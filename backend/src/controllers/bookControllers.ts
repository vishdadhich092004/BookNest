import { AuthRequest } from "../middleware/auth";
import User from "../models/user"; // Import your User model
import express, { Request, Response } from "express";
// Controller to mark a book as read by a user
export const markBookAsRead = async (req: AuthRequest, res: Response) => {
  const { bookId } = req.params; // Assume userId and bookId are sent in the request body
  const userId = req.user?.userId;
  try {
    // Add the book to the user's readBooks array, preventing duplicates with $addToSet
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { readBooks: bookId } }, // Add the book only if it hasn't been added already
      { new: true } // Return the updated document
    ).populate("readBooks"); // Optional: populate the readBooks with actual book details

    res.status(200).json({ message: "Book marked as read", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark book as read", error });
  }
};
