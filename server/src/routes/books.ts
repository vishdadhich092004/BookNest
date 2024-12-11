import express, { NextFunction, Response } from "express";
import multer from "multer";
import "dotenv/config";
import { check } from "express-validator";
import { verifyToken } from "../middleware/auth";
import * as bookController from "../controllers/bookControllers";
import { checkBookOwnership } from "../middleware/checkOwnership";
const router = express.Router();

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cpUpload = upload.fields([
  { name: "pdfFile", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

// new book - post route
router.post(
  "/new",
  verifyToken,
  cpUpload,
  [check("title", "Title is required").notEmpty()],
  [check("description", "Description is required").notEmpty()],
  [check("author", "Author is required").notEmpty()],
  [check("genre", "Genre is required").notEmpty()],
  bookController.createNewBook
);

// fetch a book by bookId
router.get("/:bookId", bookController.getABook);

// fetch all the books
router.get("/", bookController.getAllBooks);

// delete a book
router.delete(
  "/:bookId",
  verifyToken,
  checkBookOwnership,
  bookController.deleteBook
);

// mark a book as read
router.post("/:bookId/mark-read", verifyToken, bookController.markBookAsRead);

export default router;
