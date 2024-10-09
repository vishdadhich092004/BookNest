import express, { NextFunction, Request, response, Response } from "express";
import { AuthRequest, verifyToken } from "../middleware/auth";
import Discussion from "../models/discussion";
import { check, validationResult } from "express-validator";
import Comment from "../models/comment";
import * as discussionControllers from "../controllers/discussionControllers";
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
  ],
  discussionControllers.createNewDiscussion
);

// return all the discussions
router.get("/", discussionControllers.getAllDiscussions);

// find one discussion by discussionId
router.get("/:discussionId", discussionControllers.getADiscussion);

// update the discussion
router.put(
  "/:discussionId/edit",
  verifyToken,
  checkOwnership,
  discussionControllers.editDiscussion
);

router.delete(
  "/:discussionId",
  verifyToken,
  checkOwnership,
  discussionControllers.deleteDiscussion
);

router.post(
  "/:discussionId/like",
  verifyToken,
  discussionControllers.likeDiscussion
);

router.post(
  "/:discussionId/unlike",
  verifyToken,
  discussionControllers.unlikeDiscussion
);

router.post(
  "/:discussionId/dislike",
  verifyToken,
  discussionControllers.dislikeDiscussion
);
router.post(
  "/:discussionId/undislike",
  verifyToken,
  discussionControllers.undislikeDiscussion
);

export default router;
