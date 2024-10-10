import { Author } from "../models/author";
import { Request, Response } from "express";
import { getSignedUrlsForBook } from "../config/awsS3";
import { BookType } from "../shared/types";
export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Author.find({}).sort({ _id: -1 }).lean();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching authors", error });
  }
};

export const getAnAuthor = async (req: Request, res: Response) => {
  try {
    // Fetch the author by ID and populate the books
    const author = await Author.findById(req.params.authorId).populate({
      path: "books",
      populate: [
        { path: "userId" }, // Populate user details if necessary
        { path: "reviews" }, // Populate reviews if necessary
      ],
    });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Create an array of books with signed URLs
    const booksWithSignedUrls = await Promise.all(
      author.books.map(async (book: any) => {
        const bookData: BookType = {
          _id: book._id.toString(),
          title: book.title,
          description: book.description,
          author: book.author, // Ensure this includes necessary fields
          genre: book.genre, // Ensure this includes necessary fields
          pdfUrl: book.pdfUrl,
          coverPageUrl: book.coverPageUrl,
          userId: book.userId, // Ensure this includes necessary fields
          reviews: book.reviews, // Ensure this includes necessary fields
        };
        const { coverPageUrl } = await getSignedUrlsForBook(bookData);
        return { ...bookData, coverPageUrl }; // Return bookData with coverPageUrl
      })
    );

    // Construct the author response with books containing signed URLs
    const authorWithSignedUrls = {
      ...author.toObject(),
      books: booksWithSignedUrls,
    };

    res.json(authorWithSignedUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching author", error });
  }
};
