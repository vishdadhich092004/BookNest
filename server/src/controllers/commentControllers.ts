import { validationResult } from "express-validator";
import { AuthRequest } from "../middleware/auth";
import { Request, Response } from "express";
import Discussion from "../models/discussion";
import Comment from "../models/comment";

// new comment
export const createNewComment = async (req: AuthRequest, res: Response) => {
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
};

// like a comment
export const likeComment = async (req: AuthRequest, res: Response) => {
  const { discussionId, commentId } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(400).json({ message: "User not signed in" });
  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({
        message: `No Discussion Found`,
      });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "No Comment Found" });

    if (comment.likes.includes(userId))
      return res.status(400).json({ message: "Already liked" });
    // like the comment
    comment.likes.push(userId);
    // remove the dislike if present
    comment.dislikes = comment.dislikes.filter(
      (commentId) => commentId.toString() !== userId
    );
    await comment.save();
    await discussion.save();

    res.status(200).json({ message: "Post Liked" });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong , ${e}` });
  }
};

// unlike comment
export const unlikeComment = async (req: AuthRequest, res: Response) => {
  const { discussionId, commentId } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(400).json({ message: "User Access Denied" });
  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "No Discussion Found" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "No Comment Found" });

    if (!comment.likes.includes(userId))
      return res.status(400).json({ message: "Not liked yet" });

    // Remove user's like from the comment
    comment.likes = comment.likes.filter((like) => like.toString() !== userId);

    await comment.save();
    await discussion.save();

    res.status(200).json({
      message: "Post Unliked",
    });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong , ${e}` });
  }
};

// dislike a comment
export const dislikeComment = async (req: AuthRequest, res: Response) => {
  const { discussionId, commentId } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(400).json({ message: "User Access Denied" });
  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "No Discussion Found" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "No Comment Found" });

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
};

// undislike a comment
export const undislikeComment = async (req: AuthRequest, res: Response) => {
  const { discussionId, commentId } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(400).json({ message: "User Access Denied" });
  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "No Discussion Found" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "No Comment Found" });

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
};

// fetch all comments for a discussion
export const getAllComments = async (req: Request, res: Response) => {
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
};
