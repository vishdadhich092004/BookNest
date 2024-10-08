import express, { NextFunction, Response } from "express";
import multer from "multer";
import Book from "../models/book";
import "dotenv/config";
import { check } from "express-validator";
import { AuthRequest, verifyToken } from "../middleware/auth";
import * as bookController from "../controllers/bookControllers";

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

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cpUpload = upload.fields([
  { name: "pdfFile", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

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

router.get("/:bookId", bookController.getABook);

router.get("/", bookController.getAllBooks);

router.delete(
  "/:bookId",
  verifyToken,
  checkOwnership,
  bookController.deleteBook
);

router.post("/:bookId/mark-read", verifyToken, bookController.markBookAsRead);

export default router;
