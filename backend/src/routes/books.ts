import express, { Request, Response } from "express";
import multer from "multer";
import Book from "../models/book";
import crypto from "crypto";
import "dotenv/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
const router = express.Router();

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

router.post(
  "/new",
  upload.single("pdfFile"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const randomName = (bytes = 32) =>
        crypto.randomBytes(bytes).toString("hex");

      const name = `books/pdf/${randomName()}`;
      const params = {
        Bucket: bucketName,
        Key: name,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);
      const { title, description, author, genre } = req.body;
      const newBook = new Book({
        title: title,
        description: description,
        author: author,
        genre: genre,
        pdfName: name,
      });

      await newBook.save();
      // Respond with the URL of the uploaded file
      res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  const books = await Book.find({});

  for (const book of books) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: book.pdfName,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 20 });
    book.pdfUrl = url;
  }
  res.send(books);
});

export default router;
