import { AuthRequest } from "../middleware/auth";
import User from "../models/user";
import { Request, Response } from "express";
import {
  deleteFileFromS3,
  getSignedUrlsForBook,
  uploadFileToS3,
} from "../config/awsS3";
import Book from "../models/book";
import Review from "../models/review";
import { validationResult } from "express-validator";
import { Author } from "../models/author";
import { Genre } from "../models/genre";

// mark a book as read
export const markBookAsRead = async (req: AuthRequest, res: Response) => {
  const { bookId } = req.params;
  if (!bookId) {
    return res.status(404).json({ message: "Book Id undefined" });
  }
  const userId = req.user?.userId;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { readBooks: bookId } },
      { new: true }
    ).populate("readBooks");
    res.status(200).json({ message: "Book marked as read", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark book as read", error });
  }
};

// delete a book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    // check for the empty book Id
    if (!bookId) {
      return res.status(404).json({ message: "Book Id is undefined" });
    }
    // find the book from the book ID
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // perform all the 4 operations
    await Promise.all([
      deleteFileFromS3(book.pdfUrl),
      deleteFileFromS3(book.coverPageUrl),
      Review.deleteMany({ _id: { $in: book.reviews } }),
      Book.findByIdAndDelete(bookId),
    ]);

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (e) {
    res.status(502).json({ message: `Error Deleting Book: ${e}` });
  }
};

// fetch all the books wiht pagination
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { genre, author, page, limit } = req.query;
    const filter: any = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = author;

    const pageNumber = page ? Number(page) : null;
    const limitNumber = limit ? Number(limit) : null;

    let booksQuery = Book.find(filter)
      .sort({ _id: -1 })
      .lean()
      .populate("genre");

    if (pageNumber && limitNumber) {
      booksQuery = booksQuery
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    }

    const books = await booksQuery;

    const booksWithSignedUrls = await Promise.all(
      books.map(async (book) => {
        const { signedCoverPageUrl, signedPdfUrl } = await getSignedUrlsForBook(
          {
            coverPageUrl: book.coverPageUrl,
            pdfUrl: book.pdfUrl,
          }
        );
        book.coverPageUrl = signedCoverPageUrl;
        book.pdfUrl = signedPdfUrl;
        return book;
      })
    );

    if (pageNumber && limitNumber) {
      res.status(200).json({
        currentPage: pageNumber,
        totalBooks: await Book.countDocuments(filter), // Total number of books matching the filter
        booksPerPage: limitNumber,
        books: booksWithSignedUrls,
      });
    } else {
      res.status(200).json(booksWithSignedUrls); // No pagination, just return the books
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// new book
export const createNewBook = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || !files["pdfFile"] || !files["coverImage"]) {
      return res
        .status(400)
        .json({ error: "PDF file and cover image are required" });
    }

    const [pdfName, coverImgName] = await Promise.all([
      uploadFileToS3(files["pdfFile"][0], "pdf"),
      uploadFileToS3(files["coverImage"][0], "images"),
    ]);

    const {
      title,
      description,
      author: authorName,
      genre: genreName,
    } = req.body;

    // create a new genre if already not present
    let genre = await Genre.findOne({ name: genreName });
    if (!genre) {
      genre = new Genre({ name: genreName });
      await genre.save();
    }

    // create a new authr if already not present
    let author = await Author.findOne({ name: authorName });
    if (!author) {
      author = new Author({ name: authorName });
      await author.save();
    }

    const newBook = new Book({
      title,
      description,
      author: author._id,
      genre: genre._id,
      pdfUrl: pdfName,
      coverPageUrl: coverImgName,
      userId: req.user?.userId,
    });

    await newBook.save();

    // Update genre and author with the new book
    await Genre.findByIdAndUpdate(genre._id, { $push: { books: newBook._id } });
    await Author.findByIdAndUpdate(author._id, {
      $push: { books: newBook._id },
    });

    res
      .status(200)
      .json({ message: "Book uploaded successfully", bookId: newBook._id });
  } catch (error) {
    console.error("Error creating new book:", error);
    res.status(500).json({ error: "Failed to create new book" });
  }
};

// fetch a book by bookId
export const getABook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId)
      .populate({
        path: "reviews",
        populate: { path: "userId", model: "User" },
      })
      .populate("genre")
      .populate("author");

    if (!book) return res.status(404).json({ message: "No Book Found" });

    const { signedCoverPageUrl, signedPdfUrl } = await getSignedUrlsForBook({
      pdfUrl: book.pdfUrl,
      coverPageUrl: book.coverPageUrl,
    });
    book.pdfUrl = signedPdfUrl;
    book.coverPageUrl = signedCoverPageUrl;
    return res.status(200).json(book);
  } catch (e) {
    res.status(502).json({ message: "Error Fetching book" });
  }
};
