import { getSignedUrlsForBook } from "../config/awsS3";
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
    const genre = await Genre.findById(req.params.genreId).populate("books");

    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    const booksWithSignedUrls = await Promise.all(
      genre.books.map(async (book: any) => {
        const { signedCoverPageUrl } = await getSignedUrlsForBook({
          coverPageUrl: book.coverPageUrl,
          pdfUrl: book.pdfUrl,
        });
        book.coverPageUrl = signedCoverPageUrl;
        return book; // Return bookData with coverPageUrl
      })
    );
    console.log(booksWithSignedUrls);
    const genreWithSignedUrls = {
      genre,
      books: booksWithSignedUrls,
    };

    res.status(200).json(genreWithSignedUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching genre", error });
  }
};
