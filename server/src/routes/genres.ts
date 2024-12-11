import express from "express";
import * as genreControllers from "../controllers/genreControllers";
const router = express.Router();

// Get all genres
router.get("/", genreControllers.getAllGenres);

// Get a single genre by ID
router.get("/:genreId", genreControllers.getAGenre);

export default router;
