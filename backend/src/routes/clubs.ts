import express, { NextFunction, Request, Response } from "express";
import { ClubType, UserType } from "../shared/types";
import Club from "../models/club";
import { AuthRequest, verifyToken } from "../middleware/auth";
import { check, validationResult } from "express-validator";
import User from "../models/user"; // Assuming you have a User model
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import multer from "multer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
const router = express.Router();

const secretKey = process.env.AWS_SECRET_ACCESS_KEY!;
const accessKey = process.env.AWS_ACCESS_KEY_ID!;
const bucketRegion = process.env.AWS_BUCKET_REGION!;
const bucketName = process.env.AWS_BUCKET_NAME!;

// Create a new S3 client
const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cpUpload = upload.fields([
  { name: "bannerImgUrl", maxCount: 1 },
  {
    name: "profileImgUrl",
    maxCount: 1,
  },
]);

async function getSignedUrlsForClubs(club: ClubType) {
  const bannerObjectParams = {
    Bucket: bucketName,
    Key: club.bannerImgUrl,
  };
  const bannerCommand = new GetObjectCommand(bannerObjectParams);
  const bannerImgUrl = await getSignedUrl(s3, bannerCommand, { expiresIn: 20 });

  const profileObjectParams = {
    Bucket: bucketName,
    Key: club.profileImgUrl,
  };
  const profileImgCommand = new GetObjectCommand(profileObjectParams);
  const profileImgUrl = await getSignedUrl(s3, profileImgCommand);

  return {
    bannerImgUrl: bannerImgUrl,
    profileImgUrl: profileImgUrl,
  };
}

const checkOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club Not Found" });

    if (club.admin._id.toString() !== req.user?.userId)
      return res.status(403).json({ message: "You dont have permission" });
    next();
  } catch (e) {
    return res.status(500).json({ message: "Error Checking Ownership", e });
  }
};

router.post(
  "/new",
  verifyToken,
  cpUpload,
  [
    check("title", "Title is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    try {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      if (!files || !files["bannerImgUrl"] || !files["profileImgUrl"]) {
        return res
          .status(400)
          .json({ error: "Banner Image and Profile Img is neccessary" });
      }

      const randomName = (bytes = 16) => {
        return crypto.randomBytes(bytes).toString("hex");
      };
      const bannerImg = files["bannerImgUrl"][0];
      const bannerImgName = `clubs/banners/${randomName()}`;
      const bannerParams = {
        Bucket: bucketName,
        Key: bannerImgName,
        Body: bannerImg.buffer,
        ContentType: bannerImg.mimetype,
      };
      const commandBanner = new PutObjectCommand(bannerParams);
      await s3.send(commandBanner);

      const profielImg = files["profileImgUrl"][0];
      const profileImgName = `clubs/profile/${randomName()}`;
      const profileParams = {
        Bucket: bucketName,
        Key: profileImgName,
        Body: profielImg.buffer,
        ContentType: profielImg.mimetype,
      };

      const commandProfile = new PutObjectCommand(profileParams);
      await s3.send(commandProfile);

      const { title, description } = req.body;
      const userId = req.user?.userId;

      // Fetch the user to include it in the members array
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const club = new Club({
        title,
        description,
        admin: user,
        members: [user],
        bannerImgUrl: bannerImgName,
        profileImgUrl: profileImgName,
      });

      await club.save();
      res.status(200).json({ message: "Club Created Successfully", club });
    } catch (e) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  try {
    const clubs = await Club.find({})
      .populate("admin")
      .populate("members")
      .lean();
    if (!clubs) return res.status(404).json({ message: "No Clubs Found" });
    return res.status(200).json(clubs);
  } catch (e) {
    res.status(500).json({ message: "Error fetching clubs" });
  }
});

router.get("/:clubId", async (req: Request, res: Response) => {
  const { clubId } = req.params;
  try {
    const club = await Club.findById(clubId)
      .populate("admin")
      .populate("members");
    if (!club) return res.status(404).json({ message: "No Club Found" });
    const { bannerImgUrl, profileImgUrl } = await getSignedUrlsForClubs(club);
    club.profileImgUrl = profileImgUrl;
    club.bannerImgUrl = bannerImgUrl;
    return res.status(200).json(club);
  } catch (e) {
    return res.status(500).json({ message: "Something went Wrong" });
  }
});

router.post(
  "/:clubId/join",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { clubId } = req.params;
    const userId = req.user?.userId;

    try {
      if (!userId) {
        return res.status(404).json({ message: "No User Logged In" });
      }

      const club = await Club.findById(clubId).populate("members");
      if (!club) {
        return res.status(404).json({ message: "No Club Found" });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (
        club.members.some(
          (member) => member._id.toString() === user._id.toString()
        )
      ) {
        return res.status(403).json({ message: "You've already joined" });
      }

      club.members.push(user);
      await club.save();
      return res.status(200).json({ message: "User Added", club });
    } catch (e) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/:clubId/leave",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { clubId } = req.params;
    const userId = req.user?.userId;

    try {
      if (!userId) {
        return res.status(404).json({ message: "No User Logged In" });
      }

      const club = await Club.findById(clubId)
        .populate("admin")
        .populate("members");
      if (!club) {
        return res.status(404).json({ message: "No Club Found" });
      }

      if (userId === club.admin._id.toString()) {
        return res.status(403).json({ message: "Admin Cannot Leave" });
      }

      const userIndex = club.members.findIndex(
        (member) => member._id.toString() === userId
      );
      if (userIndex === -1) {
        return res
          .status(403)
          .json({ message: "You're not a member of this club" });
      }

      club.members.splice(userIndex, 1);
      await club.save();
      return res.status(200).json({ message: "User Removed from Club", club });
    } catch (e) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.delete(
  "/:clubId",
  verifyToken,
  checkOwnership,
  async (req: AuthRequest, res: Response) => {
    const { clubId } = req.params;
    try {
      const club = await Club.findById(clubId);
      if (!club) return res.status(404).json({ message: "No Club Found" });

      const bannerParams = {
        Bucket: bucketName,
        Key: club.bannerImgUrl,
      };
      const bannerCommand = new DeleteObjectCommand(bannerParams);
      await s3.send(bannerCommand);

      const profileParams = {
        Bucket: bucketName,
        Key: club.profileImgUrl,
      };
      const profileImgCommand = new DeleteObjectCommand(profileParams);
      await s3.send(profileImgCommand);

      await Club.findByIdAndDelete(clubId);
      return res.status(200).json({ message: "Club Deleted Succesfully" });
    } catch (e) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
