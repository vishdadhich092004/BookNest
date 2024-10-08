import express, { Request, Response } from "express";
import { AuthRequest, verifyToken } from "../middleware/auth";
import Discussion from "../models/discussion";
import Comment from "../models/comment";
import { check, validationResult } from "express-validator";
import * as commentControllers from "../controllers/commentControllers";
const router = express.Router();

// COMMENTS

// NEW COMMENT POST ROUTE
router.post(
  "/:discussionId/comments",
  verifyToken,
  [check("text", "Text cannot be empty").notEmpty()],
  commentControllers.createNewComment
);

// Like Route
router.post(
  "/:discussionId/comments/:commentId/like",
  verifyToken,
  commentControllers.likeComment
);
// Unlike Route
router.post(
  "/:discussionId/comments/:commentId/unlike",
  verifyToken,
  commentControllers.unlikeComment
);

// Dislike Route
router.post(
  "/:discussionId/comments/:commentId/dislike",
  verifyToken,
  commentControllers.dislikeComment
);
// Undislike Route
router.post(
  "/:discussionId/comments/:commentId/undislike",
  verifyToken,
  commentControllers.undislikeComment
);

// return all the comments under a discussion:
router.get("/:discussionId/comments", commentControllers.getAllComments);
export default router;
