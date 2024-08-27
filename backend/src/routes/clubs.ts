import express, { NextFunction, Request, Response } from "express";
import { ClubType, UserType } from "../shared/types";
import Club from "../models/club";
import { AuthRequest, verifyToken } from "../middleware/auth";
import { check, validationResult } from "express-validator";
import User from "../models/user"; // Assuming you have a User model

const router = express.Router();

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
  [
    check("title", "Title is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    try {
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

      await Club.findByIdAndDelete(clubId);
      return res.status(200).json({ message: "Club Deleted Succesfully" });
    } catch (e) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
