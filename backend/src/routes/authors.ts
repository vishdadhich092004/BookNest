import express from "express";
import * as authorControllers from "../controllers/authorControllers";
const router = express.Router();

// Get all authors
router.get("/", authorControllers.getAllAuthors);

// Get a single author by ID
router.get("/:authorId", authorControllers.getAnAuthor);

// Create a new author
// router.post("/", async (req, res) => {
//   try {
//     const newAuthor = new Author(req.body);
//     const savedAuthor = await newAuthor.save();
//     res.status(201).json(savedAuthor);
//   } catch (error) {
//     res.status(400).json({ message: "Error creating author", error });
//   }
// });

// // Update an author
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedAuthor = await Author.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedAuthor) {
//       return res.status(404).json({ message: "Author not found" });
//     }
//     res.json(updatedAuthor);
//   } catch (error) {
//     res.status(400).json({ message: "Error updating author", error });
//   }
// });

// // Delete an author
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
//     if (!deletedAuthor) {
//       return res.status(404).json({ message: "Author not found" });
//     }
//     res.json({ message: "Author deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting author", error });
//   }
// });

export default router;
