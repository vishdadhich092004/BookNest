import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import Book from "../models/book";
import crypto from "crypto";
import "dotenv/config";
import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BookType } from "../shared/types";
import { check, validationResult } from "express-validator";
import { AuthRequest, verifyToken } from "../middleware/auth";
import Review from "../models/review";

const router = express.Router();

const checkOwnership = async (
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

const secretKey = process.env.AWS_SECRET_ACCESS_KEY!;
const accessKey = process.env.AWS_ACCESS_KEY_ID!;
const bucketRegion = process.env.AWS_BUCKET_REGION!;
const bucketName = process.env.AWS_BUCKET_NAME!;

// Create a new S3 client
const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cpUpload = upload.fields([
  { name: "pdfFile", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

async function getSignedUrlsForBook(book: BookType) {
  // Generate signed URL for the PDF file
  const pdfObjectParams = {
    Bucket: bucketName,
    Key: book.pdfUrl, // Assuming `pdfUrl` stores the S3 key of the PDF file
  };
  const pdfCommand = new GetObjectCommand(pdfObjectParams);
  const pdfUrl = await getSignedUrl(s3, pdfCommand, { expiresIn: 20 });

  // Generate signed URL for the cover image
  const coverImgObjectParams = {
    Bucket: bucketName,
    Key: book.coverPageUrl, // Assuming `coverPageUrl` stores the S3 key of the cover image
  };
  const coverImgCommand = new GetObjectCommand(coverImgObjectParams);
  const coverImgUrl = await getSignedUrl(s3, coverImgCommand);

  // Return the book with updated URLs
  return {
    pdfUrl: pdfUrl,
    coverPageUrl: coverImgUrl,
  };
}

router.post(
  "/new",
  verifyToken,
  cpUpload,
  [check("title", "Title is required").notEmpty()],
  [check("description", "Description is required").notEmpty()],
  [check("author", "Author is required").notEmpty()],
  [check("genre", "Genre is required").notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      // Type assertion to specify the structure of req.files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files || !files["pdfFile"] || !files["coverImage"]) {
        return res
          .status(400)
          .json({ error: "PDF file and cover image are required" });
      }

      const randomName = (bytes = 16) => {
        return crypto.randomBytes(bytes).toString("hex");
      };

      // PDF File Upload
      const pdfFile = files["pdfFile"][0];
      const pdfName = `books/pdf/${randomName()}`;
      const pdfParams = {
        Bucket: bucketName,
        Key: pdfName,
        Body: pdfFile.buffer,
        ContentType: pdfFile.mimetype,
      };

      const pdfCommand = new PutObjectCommand(pdfParams);
      await s3.send(pdfCommand);

      // Cover Image Upload
      const coverImage = files["coverImage"][0];
      const coverImgName = `books/images/${randomName()}`;
      const imageParams = {
        Bucket: bucketName,
        Key: coverImgName,
        Body: coverImage.buffer,
        ContentType: coverImage.mimetype,
      };

      const imgCommand = new PutObjectCommand(imageParams);
      await s3.send(imgCommand);

      const userId = req.user?.userId;
      // console.log(userId);
      // Save book details to database
      const { title, description, author, genre } = req.body;
      const newBook = new Book({
        title,
        description,
        author,
        genre,
        pdfUrl: pdfName,
        coverPageUrl: coverImgName,
        userId: userId,
      });

      await newBook.save();

      res.status(200).json({ message: "Book uploaded successfully" });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  }
);

router.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId)
      .populate({
        path: "reviews",
        populate: { path: "userId", model: "User" },
      })
      .exec();
    if (!book) return res.status(404).json({ message: "No Book Found" });

    const { pdfUrl, coverPageUrl } = await getSignedUrlsForBook(book); // Pass the single book object here
    book.pdfUrl = pdfUrl;
    book.coverPageUrl = coverPageUrl;
    // res.json(book);
    return res.status(200).json(book);
  } catch (e) {
    res.status(502).json({ message: "Error Fetching book" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    // Extract query parameters for genre and author
    const { genre, author } = req.query;

    // Build a dynamic filter object based on query parameters
    const filter: any = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = author;

    // Fetch books from the database based on the filter
    const books = await Book.find(filter).lean();

    const booksWithSignedUrls = await Promise.all(
      books.map(async (book) => {
        // Generate signed URLs for the PDF and cover image
        const pdfObjectParams = {
          Bucket: bucketName,
          Key: book.pdfUrl,
        };
        const pdfCommand = new GetObjectCommand(pdfObjectParams);
        const pdfUrl = await getSignedUrl(s3, pdfCommand, { expiresIn: 20 });

        const coverImgObjectParams = {
          Bucket: bucketName,
          Key: book.coverPageUrl,
        };
        const coverImgCommand = new GetObjectCommand(coverImgObjectParams);
        const coverImgUrl = await getSignedUrl(s3, coverImgCommand);

        // Return the book with updated URLs
        return {
          ...book,
          pdfUrl,
          coverPageUrl: coverImgUrl,
        };
      })
    );

    res.status(200).json(booksWithSignedUrls);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

router.delete(
  "/:bookId",
  verifyToken,
  checkOwnership,
  async (req: Request, res: Response) => {
    try {
      const { bookId } = req.params;
      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ messge: "Book not found" });

      const pdfParams = {
        Bucket: bucketName,
        Key: book?.pdfUrl,
      };
      const pdfCommand = new DeleteObjectCommand(pdfParams);
      await s3.send(pdfCommand);
      const coverImgParams = {
        Bucket: bucketName,
        Key: book?.coverPageUrl,
      };
      const coverImgCommand = new DeleteObjectCommand(coverImgParams);
      await s3.send(coverImgCommand);
      await Review.deleteMany({ _id: { $in: book.reviews } });
      await Book.findByIdAndDelete(bookId);
      res.status(200).json({ message: "Deleted Succesfully" });
    } catch (e) {
      res.status(502).json({ message: `Error Deleting Book,${e}` });
    }
  }
);

router.get("/books", async (req: Request, res: Response) => {
  const { genre } = req.query;
  try {
    const filter = genre ? { genre: genre.toString() } : {};

    const books = await Book.find(filter);
    res.status(200).json(books);
  } catch (e) {
    res.status(500).json({ message: "ERROR FETCHING BOOKS", e });
  }
});

export default router;
