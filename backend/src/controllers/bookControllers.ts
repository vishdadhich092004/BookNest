import { AuthRequest } from "../middleware/auth";
import User from "../models/user";
import { Request, Response } from "express";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import { getSignedUrlsForBook, s3 } from "../config/awsS3";
import Book from "../models/book";
import Review from "../models/review";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";
import { validationResult } from "express-validator";
import { BookType } from "../shared/types";
import { Author } from "../models/author";
import { Genre } from "../models/genre";

const bucketName = process.env.AWS_BUCKET_NAME!;

// Reusable function to generate signed URLs for S3 objects

// Reusable function to upload file to S3
async function uploadFileToS3(
  file: Express.Multer.File,
  prefix: string
): Promise<string> {
  const randomName = crypto.randomBytes(16).toString("hex");
  const key = `books/${prefix}/${randomName}`;
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  await s3.send(new PutObjectCommand(params));
  return key;
}

// Reusable function to delete file from S3
async function deleteFileFromS3(key: string): Promise<void> {
  const params = { Bucket: bucketName, Key: key };
  await s3.send(new DeleteObjectCommand(params));
}

export const markBookAsRead = async (req: AuthRequest, res: Response) => {
  const { bookId } = req.params;
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

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

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
        const { pdfUrl, coverPageUrl } = await getSignedUrlsForBook(book);
        return { ...book, pdfUrl, coverPageUrl };
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

    // Handle Genre
    let genre = await Genre.findOne({ name: genreName });
    if (!genre) {
      genre = new Genre({ name: genreName });
      await genre.save();
    }

    // Handle Author
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

export const getABook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId)
      .populate({
        path: "reviews",
        populate: { path: "userId", model: "User" },
      })
      .populate("genre")
      .populate("author")
      .exec();

    if (!book) return res.status(404).json({ message: "No Book Found" });

    const { pdfUrl, coverPageUrl } = await getSignedUrlsForBook(book);
    book.pdfUrl = pdfUrl;
    book.coverPageUrl = coverPageUrl;

    return res.status(200).json(book);
  } catch (e) {
    res.status(502).json({ message: "Error Fetching book" });
  }
};
