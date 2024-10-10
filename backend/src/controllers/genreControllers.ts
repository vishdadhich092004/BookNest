import { Genre } from "../models/genre";
import { Request, Response } from "express";
export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Genre.find({}).sort({ _id: -1 }).lean();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: "Error fetching genres", error });
  }
};

export const getAGenre = async (req: Request, res: Response) => {
  try {
    const genre = await Genre.findById(req.params.genreId);

    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }
    res.json(genre);
  } catch (error) {
    res.status(500).json({ message: "Error fetching genre", error });
  }
};
