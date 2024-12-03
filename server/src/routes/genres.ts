import express from "express";
import * as genreControllers from "../controllers/genreControllers";
const router = express.Router();

// Get all genres
router.get("/", genreControllers.getAllGenres);

// Get a single genre by ID
router.get("/:genreId", genreControllers.getAGenre);

// // Create a new genre
// router.post("/", async (req, res) => {
//   try {
//     const newGenre = new Genre(req.body);
//     const savedGenre = await newGenre.save();
//     res.status(201).json(savedGenre);
//   } catch (error) {
//     res.status(400).json({ message: "Error creating genre", error });
//   }
// });

// // Update a genre
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedGenre = await Genre.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedGenre) {
//       return res.status(404).json({ message: "Genre not found" });
//     }
//     res.json(updatedGenre);
//   } catch (error) {
//     res.status(400).json({ message: "Error updating genre", error });
//   }
// });

// // Delete a genre
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
//     if (!deletedGenre) {
//       return res.status(404).json({ message: "Genre not found" });
//     }
//     res.json({ message: "Genre deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting genre", error });
//   }
// });

export default router;
