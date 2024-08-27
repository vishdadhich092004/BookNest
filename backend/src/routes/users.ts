import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import Comment from "../models/comment";
import { check, validationResult } from "express-validator";
import { Role, assignPermissions } from "../config/rolesConfig";
import Book from "../models/book";
import Club from "../models/club";
import Discussion from "../models/discussion";
const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      let user = await User.findOne({
        email: req.body.email,
      });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const { email, firstName, lastName, password, role } = req.body;
      const permissions = assignPermissions(role as Role);
      user = new User({
        email,
        firstName,
        lastName,
        password,
        role,
        permissions,
      });
      await user.save();
      const token = jwt.sign(
        { userId: user._id, role: user.role, permissions },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      return res.status(200).send(user);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

router.get("/:userId/comments", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const comments = await Comment.find({ userId: userId });
    return res.status(200).json(comments);
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});
router.get("/:userId/discussions", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const discussions = await Discussion.find({ userId: userId });
    return res.status(200).json(discussions);
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});
router.get("/:userId/clubs", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const clubs = await Club.find({
      $or: [{ admin: userId }, { members: userId }],
    });
    return res.status(200).json(clubs);
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});
router.get("/:userId/books", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const books = await Book.find({ userId: userId });
    return res.status(200).json(books);
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
