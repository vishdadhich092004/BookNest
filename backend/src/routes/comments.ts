import express, { Request, Response } from "express";
import { AuthRequest, verifyToken } from "../middleware/auth";
import Discussion from "../models/discussion";
import Comment from "../models/comment";
import { check, validationResult } from "express-validator";
const router = express.Router();

// COMMENTS

// NEW COMMENT POST ROUTE
router.post(
  "/:discussionId/comments",
  verifyToken,
  [check("text", "Text cannot be empty").notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const { discussionId } = req.params;
      const discussion = await Discussion.findById(discussionId);
      if (!discussion)
        return res.status(404).json({ message: "No discussion found" });

      const userId = req.user?.userId;
      const { text } = req.body;
      const comment = new Comment({ discussionId, userId, text });
      discussion.comments.push(comment);
      await comment.save();
      await discussion.save();

      // Populate userId field
      const populatedComment = await Comment.findById(comment._id).populate({
        path: "userId",
        select: "firstName lastName",
      });

      res.status(200).json({
        message: "Comment created successfully",
        comment: populatedComment,
      });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// Like Route
router.post(
  "/:discussionId/comments/:commentId/like",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { discussionId, commentId } = req.params;
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "User Access Denied" });
    try {
      const discussion = await Discussion.findById(discussionId);
      if (!discussion)
        return res.status(404).json({ message: "No Discussion Found" });

      const comment = await Comment.findById(commentId);
      if (!comment)
        return res.status(404).json({ message: "No Comment Found" });

      if (comment.likes.includes(userId))
        return res.status(400).json({ message: "Already liked" });

      comment.likes.push(userId);
      comment.dislikes = comment.dislikes.filter(
        (commentId) => commentId.toString() !== userId
      );
      await comment.save();
      await discussion.save();

      res
        .status(200)
        .json({ message: "Post Liked", likes: comment.likes.length });
    } catch (e) {
      res.status(500).json({ message: `Something went wrong , ${e}` });
    }
  }
);
// Unlike Route
router.post(
  "/:discussionId/comments/:commentId/unlike",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { discussionId, commentId } = req.params;
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "User Access Denied" });
    try {
      const discussion = await Discussion.findById(discussionId);
      if (!discussion)
        return res.status(404).json({ message: "No Discussion Found" });

      const comment = await Comment.findById(commentId);
      if (!comment)
        return res.status(404).json({ message: "No Comment Found" });

      if (!comment.likes.includes(userId))
        return res.status(400).json({ message: "Not liked yet" });

      // Remove user's like from the comment
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== userId
      );

      await comment.save();
      await discussion.save();

      res.status(200).json({
        message: "Post Unliked",
        likes: comment.likes.length,
      });
    } catch (e) {
      res.status(500).json({ message: `Something went wrong , ${e}` });
    }
  }
);

// Dislike Route
router.post(
  "/:discussionId/comments/:commentId/dislike",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { discussionId, commentId } = req.params;
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "User Access Denied" });
    try {
      const discussion = await Discussion.findById(discussionId);
      if (!discussion)
        return res.status(404).json({ message: "No Discussion Found" });

      const comment = await Comment.findById(commentId);
      if (!comment)
        return res.status(404).json({ message: "No Comment Found" });

      if (comment.dislikes.includes(userId))
        return res.status(400).json({ message: "Already Disliked" });

      comment.dislikes.push(userId);
      comment.likes = comment.likes.filter(
        (commentId) => commentId.toString() !== userId
      );

      await comment.save();
      await discussion.save();

      res.status(200).json(comment);
    } catch (e) {
      res.status(500).json({ message: `Something went wrong , ${e}` });
    }
  }
);
// Undislike Route
router.post(
  "/:discussionId/comments/:commentId/undislike",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { discussionId, commentId } = req.params;
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "User Access Denied" });
    try {
      const discussion = await Discussion.findById(discussionId);
      if (!discussion)
        return res.status(404).json({ message: "No Discussion Found" });

      const comment = await Comment.findById(commentId);
      if (!comment)
        return res.status(404).json({ message: "No Comment Found" });

      if (!comment.dislikes.includes(userId))
        return res.status(400).json({ message: "Not disliked yet" });

      // Remove user's dislike from the comment
      comment.dislikes = comment.dislikes.filter(
        (dislike) => dislike.toString() !== userId
      );

      await comment.save();
      await discussion.save();

      res.status(200).json(comment);
    } catch (e) {
      res.status(500).json({ message: `Something went wrong , ${e}` });
    }
  }
);

// return all the comments under a discussion:
router.get("/:discussionId/comments", async (req: Request, res: Response) => {
  const { discussionId } = req.params;
  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "No Discussion Found" });
    const allComments = discussion.comments;
    res.status(200).json(allComments);
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong, ${e}` });
  }
});
export default router;
