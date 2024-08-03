import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Discussion from "../models/discussion";
import { check, validationResult } from "express-validator";
import { DiscussionType } from "../shared/types";
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
      discussion.createdAt = Date.now();
      discussion.updatedAt = Date.now();
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
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discussion = await Discussion.findById(id);
    if (!discussion) res.status(404).json({ message: "No discussion found" });
    res.status(200).send(discussion);
  } catch (e) {
    res.status(501).json({ message: "Something went wrong" });
  }
});

export default router;
