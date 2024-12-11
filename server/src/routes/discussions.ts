import express from "express";
import { verifyToken } from "../middleware/auth";
import { check } from "express-validator";
import * as discussionControllers from "../controllers/discussionControllers";
import { checkDiscussionOwnership } from "../middleware/checkOwnership";
const router = express.Router();

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

// fetch all the discussions
router.get("/", discussionControllers.getAllDiscussions);

// find one discussion by discussionId
router.get("/:discussionId", discussionControllers.getADiscussion);

// update the discussion
router.put(
  "/:discussionId/edit",
  verifyToken,
  checkDiscussionOwnership,
  discussionControllers.editDiscussion
);

// delete a discussion
router.delete(
  "/:discussionId",
  verifyToken,
  checkDiscussionOwnership,
  discussionControllers.deleteDiscussion
);

// like a discussion
router.post(
  "/:discussionId/like",
  verifyToken,
  discussionControllers.likeDiscussion
);

// unlike a discussion
router.post(
  "/:discussionId/unlike",
  verifyToken,
  discussionControllers.unlikeDiscussion
);

// dislike a discussion
router.post(
  "/:discussionId/dislike",
  verifyToken,
  discussionControllers.dislikeDiscussion
);

// undislike a discussion
router.post(
  "/:discussionId/undislike",
  verifyToken,
  discussionControllers.undislikeDiscussion
);

export default router;
