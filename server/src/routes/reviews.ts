import express from "express";
import { verifyToken } from "../middleware/auth";
import { check } from "express-validator";
import * as reviewControllers from "../controllers/reviewControllers";
const router = express.Router();

// COMMENTS

// NEW Review POST ROUTE
router.post(
  "/:bookId/reviews",
  verifyToken,
  [check("text", "Text cannot be empty").notEmpty()],
  [check("rating", "Rating is required").notEmpty()],
  reviewControllers.createNewReview
);

export default router;
