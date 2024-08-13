import express, { Request, response, Response } from "express";
import verifyToken from "../middleware/auth";
import Discussion from "../models/discussion";
import { check, validationResult } from "express-validator";
import { CommentType, DiscussionType } from "../shared/types";
import Comment from "../models/comment";
const router = express.Router();

// new discussion create - post route
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

// return all the discussions
router.get("/", async (req: Request, res: Response) => {
  try {
    const allDiscussions = await Discussion.find({});
    res.status(200).send(allDiscussions);
  } catch (e) {
    res.status(501).json({ message: "Something went wrong" });
  }
});

// find one discussion by discussionId
router.get("/:discussionId", async (req: Request, res: Response) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId)
      .populate("comments")
      .exec();
    if (!discussion) res.status(404).json({ message: "No discussion found" });
    res.status(200).json(discussion);
  } catch (e) {
    res.status(501).json({ message: "Something went wrong" });
  }
});

// update the discussion
router.put("/:discussionId/edit", async (req: Request, res: Response) => {
  try {
    const EditDiscussionFormData = req.body;
    const { discussionId } = req.params;
    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      discussionId,
      EditDiscussionFormData,
      { new: true }
    );
    if (!updatedDiscussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    await updatedDiscussion.save();
    res.status(200).json(updatedDiscussion);
  } catch (e) {
    res.status(500).json({ message: "Error updating discussion", e });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const discussion = await Discussion.findById(id);
    if (!discussion)
      return res.status(404).json({ message: "No Discussion Found" });
    // res.send(discussion);
    await Comment.deleteMany({ _id: { $in: discussion.comments } });
    await Discussion.findByIdAndDelete(id);
    res.status(200).json({ message: "Discussion Deleted Succesfully" });
  } catch (e) {
    return res.status(502).json({ message: `Error Deleting Discussion ${e}` });
  }
});

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
