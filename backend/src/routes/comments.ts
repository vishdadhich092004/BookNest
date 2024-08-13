import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const { discussionId } = req.params;
      const discussion = await Discussion.findById(discussionId);
      if (!discussion)
        return res.status(404).json({ message: "No discussion found" });

      const userId = req.userId;
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

      res
        .status(200)
        .json({
          message: "Comment created successfully",
          comment: populatedComment,
        });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
