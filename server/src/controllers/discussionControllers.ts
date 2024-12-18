import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Discussion from "../models/discussion";
import { AuthRequest } from "../middleware/auth";
import Comment from "../models/comment";

// new discussion
export const createNewDiscussion = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "User Access Denied" });

    const { title, description, bookId } = req.body;

    const discussion = new Discussion({
      userId,
      title,
      description,
      bookId: bookId ? bookId : null,
    });

    // res.send(discussion);
    await discussion.save();

    res.status(200).send({ message: "Discussion created successfully." });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong", e });
  }
};

// fetch all discussions
export const getAllDiscussions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalDiscussions = await Discussion.countDocuments();
    const allDiscussions = await Discussion.find({})
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .populate("userId")
      .populate("bookId");

    res.status(200).json({
      discussions: allDiscussions,
      currentPage: page,
      totalPages: Math.ceil(totalDiscussions / limit),
      totalDiscussions: totalDiscussions,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// fetch a discussion using dicussion id
export const getADiscussion = async (req: Request, res: Response) => {
  try {
    const discussion = await Discussion.findById(req.params.discussionId)
      .populate("userId")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
        },
      })
      .populate("bookId");

    if (!discussion) {
      return res.status(404).json({ message: "No discussion found" });
    }

    res.status(200).json(discussion);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteDiscussion = async (req: AuthRequest, res: Response) => {
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
    return res.status(502).json({ message: `Error Deleting Discussion ${e}` });
  }
};

export const likeDiscussion = async (req: AuthRequest, res: Response) => {
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
};

export const unlikeDiscussion = async (req: AuthRequest, res: Response) => {
  const { discussionId } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(400).json({ message: "User Access Denied" });

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "No Discussion Found" });

    if (!discussion.likes.includes(userId))
      return res
        .status(400)
        .json({ message: "You have not liked this post yet" });

    discussion.likes = discussion.likes.filter(
      (likeId) => likeId.toString() !== userId
    );

    await discussion.save();
    res.status(200).json({
      message: "Post Unliked",
      likes: discussion.likes.length,
    });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const dislikeDiscussion = async (req: AuthRequest, res: Response) => {
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
};

export const undislikeDiscussion = async (req: AuthRequest, res: Response) => {
  const { discussionId } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(400).json({ message: "User Access Denied" });

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "No Discussion Found" });

    if (!discussion.dislikes.includes(userId))
      return res
        .status(400)
        .json({ message: "You have not disliked this post yet" });

    discussion.dislikes = discussion.dislikes.filter(
      (dislikeId) => dislikeId.toString() !== userId
    );

    await discussion.save();
    res.status(200).json({
      message: "Post Undisliked",
      dislikes: discussion.dislikes.length,
    });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// edit discussion
export const editDiscussion = async (req: AuthRequest, res: Response) => {
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
};
