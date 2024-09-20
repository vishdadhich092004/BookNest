import express, { Request, Response } from "express";
import Book from "../models/book";
import Discussion from "../models/discussion";
import Club from "../models/club";
import Comment from "../models/comment";
import Review from "../models/review";

export const search = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    if (!searchTerm) {
      return res.status(400).json({ message: "Query is Empty" });
    }
    const bookResults = await Book.find({
      $text: { $search: searchTerm },
    }).select("title description author genre");
    const discussionResults = await Discussion.find({
      $text: { $search: searchTerm },
    }).select("title description");
    const clubResults = await Club.find({
      $text: { $search: searchTerm },
    }).select("title description");
    const commentResults = await Comment.find({
      $text: { $search: searchTerm },
    }).select("text");
    const reviewResults = await Review.find({
      $text: { $search: searchTerm },
    }).select("text");

    const [books, comments, discussions, reviews, clubs] = await Promise.all([
      bookResults,
      commentResults,
      discussionResults,
      reviewResults,
      clubResults,
    ]);

    res.status(200).json({ books, comments, discussions, reviews, clubs });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong at the backend" });
  }
};
