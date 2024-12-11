import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth";
import Book from "../models/book";
import Discussion from "../models/discussion";

export const checkBookOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book Not Found" });

    if (book.userId.toString() !== req.user?.userId)
      return res.status(403).json({ message: "You dont have permission" });
    next();
  } catch (e) {
    return res.status(500).json({ message: `Error Checking Ownership ${e}` });
  }
};

export const checkDiscussionOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "Discussion Not Found" });

    if (discussion.userId.toString() !== req.user?.userId)
      return res.status(403).json({ message: "You dont have permission" });
    next();
  } catch (e) {
    return res.status(500).json({ message: "Error Checking Ownership", e });
  }
};
