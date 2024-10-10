import { Author } from "../models/author";
import { Request, Response } from "express";
export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Author.find({});
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching authors", error });
  }
};

export const getAnAuthor = async (req: Request, res: Response) => {
  try {
    const author = await Author.findById(req.params.genreId);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: "Error fetching author", error });
  }
};
