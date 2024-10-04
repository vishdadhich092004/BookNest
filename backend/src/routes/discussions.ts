import express, { NextFunction, Request, response, Response } from "express";
import { AuthRequest, verifyToken } from "../middleware/auth";
import Discussion from "../models/discussion";
import { check, validationResult } from "express-validator";
import Comment from "../models/comment";
const router = express.Router();

const checkOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "Discussion Not Found" });

    if (discussion.userId.toString() !== req.user?.userId)
      return res.status(403).json({ message: "You dont have permission" });
    next();
  } catch (e) {
    return res.status(500).json({ message: "Error Checking Ownership", e });
  }
};

// new discussion create - post route
router.post(
  "/new",
  verifyToken,
  [
    check("title", "Title is required").notEmpty(),
    check("description", "Description cannot be empty").notEmpty(),
    check("book", "Book is required").notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      const userId = req.user?.userId;
      if (!userId)
        return res.status(400).json({ message: "User Access Denied" });
      const { title, description, book } = req.body;
      const discussion = new Discussion({ userId, title, description, book });
      await discussion.save();
      res.status(200).send({ message: "Discussion created successfully." });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
router.get(":/discussionId/owner", async (req: Request, res: Response) => {
  const { discussionId } = req.params;
  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "No discussion Found" });
    const user = discussion.userId;
    if (!user) return res.status(404).json({ message: "No user Found" });
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Something went Wrong" });
  }
});
// return all the discussions
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalDiscussions = await Discussion.countDocuments();
    const allDiscussions = await Discussion.find({})
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName"); // Assuming you want to populate user information

    res.status(200).json({
      discussions: allDiscussions,
      currentPage: page,
      totalPages: Math.ceil(totalDiscussions / limit),
      totalDiscussions: totalDiscussions,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// find one discussion by discussionId
router.get("/:discussionId", async (req: Request, res: Response) => {
  try {
    const discussion = await Discussion.findById(req.params.discussionId)
      .populate("userId", "firstName lastName")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName",
        },
      });

    if (!discussion) {
      return res.status(404).json({ message: "No discussion found" });
    }

    res.status(200).json(discussion);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// update the discussion
router.put(
  "/:discussionId/edit",
  verifyToken,
  checkOwnership,
  async (req: AuthRequest, res: Response) => {
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
  }
);

router.delete(
  "/:discussionId",
  verifyToken,
  checkOwnership,
  async (req: AuthRequest, res: Response) => {
    const { discussionId } = req.params;
    try {
      const discussion = await Discussion.findById(discussionId);
      if (!discussion)
        return res.status(404).json({ message: "No Discussion Found" });
      // res.send(discussion);
      await Comment.deleteMany({ _id: { $in: discussion.comments } });
      await Discussion.findByIdAndDelete(discussionId);
      res.status(200).json({ message: "Discussion Deleted Succesfully" });
    } catch (e) {
      return res
        .status(502)
        .json({ message: `Error Deleting Discussion ${e}` });
    }
  }
);

router.post(
  "/:discussionId/like",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { discussionId } = req.params;
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "User Access Denied" });
    try {
      const discussion = await Discussion.findById(discussionId);
      if (!discussion)
        return res.status(404).json({ message: "No Discussion Found" });
      if (discussion.likes.includes(userId))
        return res
          .status(400)
          .json({ message: "You have already liked the post" });

      discussion.likes.push(userId);
      discussion.dislikes = discussion.dislikes.filter(
        (discussionId) => discussionId.toString() !== userId
      );
      await discussion.save();
      res
        .status(200)
        .json({ message: "Post Liked", likes: discussion.likes.length });
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/:discussionId/dislike",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const { discussionId } = req.params;
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "User Access Denied" });

    try {
      const discussion = await Discussion.findById(discussionId);
      if (!discussion)
        return res.status(404).json({ message: "No Discussion Found" });

      if (discussion.dislikes.includes(userId))
        return res
          .status(400)
          .json({ message: "You have already disliked the discussion" });

      discussion.dislikes.push(userId);
      discussion.likes = discussion.likes.filter(
        (discussionId) => discussionId.toString() !== userId
      );

      await discussion.save();
      res.status(200).json({ message: "Post Disliked!" });
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
