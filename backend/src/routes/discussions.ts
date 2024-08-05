import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Discussion from "../models/discussion";
import { check, validationResult } from "express-validator";
import { CommentType, DiscussionType } from "../shared/types";
import Comment from "../models/comment";
const router = express.Router();

router.post(
  "/new",
  verifyToken,
  [
    check("title", "Title is required").notEmpty(),
    check("description", "Description cannot be empty").notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      const discussion = new Discussion(req.body);
      discussion.createdBy = req.userId as string;
      discussion.createdAt = new Date();
      discussion.updatedAt = new Date();
      await discussion.save();
      res.status(200).send({ message: "Discussion created successfully." });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  try {
    const allDiscussions = await Discussion.find({});
    res.status(200).send(allDiscussions);
  } catch (e) {
    res.status(501).json({ message: "Something went wrong" });
  }
});
router.get("/:discussionId", async (req: Request, res: Response) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId)
      .populate("comments")
      .exec();
    if (!discussion) res.status(404).json({ message: "No discussion found" });
    res.status(200).send(discussion);
  } catch (e) {
    res.status(501).json({ message: "Something went wrong" });
  }
});

// comments

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
      if (!discussion) res.status(404).json({ message: "No discussion found" });
      const comment = new Comment(req.body);
      comment.timestamp = new Date();
      comment.user = req.userId;
      discussion?.comments.push(comment as any);
      await comment.save();
      await discussion?.save();
      res.status(200).json({ message: "Comment created succesfully" });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
