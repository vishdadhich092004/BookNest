import { getSignedUrlsForBook } from "../config/awsS3";
import { Genre } from "../models/genre";
import { Request, Response } from "express";
import { BookType } from "../shared/types";

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Genre.find({}).sort({ _id: -1 }).lean();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: "Error fetching genres", error });
  }
};

export const getAGenre = async (req: Request, res: Response) => {
  try {
    const genre = await Genre.findById(req.params.genreId).populate({
      path: "books",
      populate: [
        { path: "author" }, // Populate author details
        { path: "userId" }, // Populate user details
        { path: "reviews" }, // Populate review details if needed
      ],
    });

    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    const booksWithSignedUrls = await Promise.all(
      genre.books.map(async (book: any) => {
        // Construct the bookData based on BookType
        const bookData: BookType = {
          _id: book._id.toString(),
          title: book.title,
          description: book.description,
          author: book.author, // Make sure this includes necessary fields
          genre: book.genre, // Make sure this includes necessary fields
          pdfUrl: book.pdfUrl,
          coverPageUrl: book.coverPageUrl,
          userId: book.userId, // Make sure this includes necessary fields
          reviews: book.reviews, // Make sure this includes necessary fields
        };
        const { coverPageUrl } = await getSignedUrlsForBook(bookData);
        return { ...bookData, coverPageUrl }; // Return bookData with coverPageUrl
      })
    );

    const genreWithSignedUrls = {
      ...genre.toObject(),
      books: booksWithSignedUrls,
    };

    res.json(genreWithSignedUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching genre", error });
  }
};
