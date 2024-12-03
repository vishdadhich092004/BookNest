import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthRequest } from "../middleware/auth";
import Book from "../models/book";
import Review from "../models/review";

export const createNewReview = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "No Book found" });

    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "User Access Denied" });

    const { rating, text } = req.body;
    const review = new Review({ bookId, userId, rating, text });
    book.reviews.push(review);
    await review.save();
    await book.save();

    res.status(200).json({ message: "Review created successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
