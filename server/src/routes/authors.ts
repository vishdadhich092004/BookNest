import express from "express";
import * as authorControllers from "../controllers/authorControllers";
const router = express.Router();

// Get all authors
router.get("/", authorControllers.getAllAuthors);

// Get a single author by ID
router.get("/:authorId", authorControllers.getAnAuthor);

export default router;
