import express, { Request, Response } from "express";
import Book from "../models/book";
import Discussion from "../models/discussion";
import Comment from "../models/comment";
import Review from "../models/review";

// Helper function to generate fuzzy regex
function generateFuzzyRegex(term: string): RegExp {
  const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const fuzzyTerm = escapedTerm.split("").join(".*");
  return new RegExp(fuzzyTerm, "i");
}

// Helper function to calculate relevance score
function calculateScore(text: string, searchTerm: string): number {
  const normalizedText = text.toLowerCase();
  const normalizedTerm = searchTerm.toLowerCase();

  let score = 0;
  if (normalizedText.includes(normalizedTerm)) score += 10;
  if (normalizedText.startsWith(normalizedTerm)) score += 5;

  const words = normalizedText.split(/\s+/);
  score += words.filter((word) => word.startsWith(normalizedTerm)).length * 3;

  return score;
}

// Generic function to search and score a collection
async function searchCollection(
  model: any,
  searchFields: string[],
  searchTerm: string,
  limit: number
) {
  const fuzzyRegex = generateFuzzyRegex(searchTerm);
  const query = {
    $or: searchFields.map((field) => ({ [field]: { $regex: fuzzyRegex } })),
  };

  const results = await model.find(query).lean().exec();

  const scoredResults = results.map((item: any) => ({
    ...item,
    score: Math.max(
      ...searchFields.map((field) =>
        calculateScore(item[field] || "", searchTerm)
      )
    ),
  }));

  return scoredResults
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, limit);
}

export const search = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    if (!searchTerm) {
      return res.status(400).json({ message: "Query is Empty" });
    }

    const limit = 10; // Limit results per category

    const [books, discussions, comments, reviews] = await Promise.all([
      searchCollection(
        Book,
        ["title", "description", "author", "genre"],
        searchTerm,
        limit
      ),
      searchCollection(Discussion, ["title", "description"], searchTerm, limit),
      searchCollection(Comment, ["text"], searchTerm, limit),
      searchCollection(Review, ["text"], searchTerm, limit),
    ]);

    res.status(200).json({ books, discussions, comments, reviews });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Something went wrong at the backend",
    });
  }
};
