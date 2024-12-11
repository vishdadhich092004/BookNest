import { Request, Response } from "express";
import Book from "../models/book";
import Discussion from "../models/discussion";
import Comment from "../models/comment";
import Review from "../models/review";
import { Genre } from "../models/genre";
import { Author } from "../models/author";

// Helper function to generate fuzzy regex
function generateFuzzyRegex(term: string): RegExp {
  const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const fuzzyTerm = escapedTerm.split("").join(".*");
  return new RegExp(fuzzyTerm, "i");
}

// Generic function to search a collection
async function searchCollection(
  model: any,
  searchFields: string[],
  searchTerm: string,
  limit: number,
  populate?: { path: string; select: string }[]
) {
  const fuzzyRegex = generateFuzzyRegex(searchTerm);
  const query = {
    $or: searchFields.map((field) => ({ [field]: { $regex: fuzzyRegex } })),
  };

  let results = model.find(query);

  if (populate) {
    populate.forEach((populateOption) => {
      results = results.populate(populateOption);
    });
  }

  return results.limit(limit).lean().exec();
}

export const search = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    if (!searchTerm) {
      return res.status(400).json({ message: "Query is Empty" });
    }

    const limit = 10; // Limit results per category

    const [books, discussions, comments, reviews, genres, authors] =
      await Promise.all([
        searchCollection(Book, ["title", "description"], searchTerm, limit, [
          { path: "genre", select: "name" },
          { path: "author", select: "name" },
        ]),
        searchCollection(
          Discussion,
          ["title", "description"],
          searchTerm,
          limit
        ),
        searchCollection(Comment, ["text"], searchTerm, limit),
        searchCollection(Review, ["text"], searchTerm, limit),
        searchCollection(Genre, ["name"], searchTerm, limit),
        searchCollection(Author, ["name"], searchTerm, limit),
      ]);

    res
      .status(200)
      .json({ books, discussions, comments, reviews, genres, authors });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Something went wrong at the server",
    });
  }
};
