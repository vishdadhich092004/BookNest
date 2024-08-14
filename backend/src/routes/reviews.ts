import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Book from "../models/book";
import Review from "../models/review";
import { check, validationResult } from "express-validator";
const router = express.Router();

// COMMENTS

// NEW Review POST ROUTE
router.post(
  "/:bookId/reviews",
  verifyToken,
  [check("text", "Text cannot be empty").notEmpty()],
  [check("rating", "Rating is required").notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const { bookId } = req.params;
      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: "No Book found" });

      const userId = req.userId;
      const { rating, text } = req.body;
      const review = new Review({ bookId, userId, rating, text });
      book.reviews.push(review);
      await review.save();
      await book.save();

      // Populate userId field
      const populatedReview = await Review.findById(review._id).populate({
        path: "userId",
        select: "firstName lastName",
      });

      res.status(200).json({ message: "Review created successfully" });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
