import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Comment from "../models/comment";
import User from "../models/user";
import jwt from "jsonwebtoken";
import Book from "../models/book";

import Discussion from "../models/discussion";
import { AuthRequest } from "../middleware/auth";

export const register = async (req: Request, res: Response) => {
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
    user = new User({
      email,
      firstName,
      lastName,
      password,
      role,
    });
    user.setRandomAvatar();
    await user.save();
    const token = jwt.sign(
      { userId: user._id, role: user.role },
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
};

export const getUserComments = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const comments = await Comment.find({ userId: userId });
    return res.status(200).json(comments);
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserDiscussions = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const discussions = await Discussion.find({ userId: userId });
    return res.status(200).json(discussions);
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserBooks = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const books = await Book.find({ userId: userId });
    return res.status(200).json(books);
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Delete the user
    await User.findByIdAndDelete(userId);
    res.cookie("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    });
    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};
