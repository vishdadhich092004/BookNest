import { Author } from "../models/author";
import { Request, Response } from "express";
import { getSignedUrlsForBook } from "../config/awsS3";
export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Author.find({}).sort({ _id: -1 }).lean();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching authors", error });
  }
};

export const getAnAuthor = async (req: Request, res: Response) => {
  try {
    // Fetch the author by ID and populate the books
    const author = await Author.findById(req.params.authorId).populate("books");
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Create an array of books with signed URLs
    const booksWithSignedUrls = await Promise.all(
      author.books.map(async (book: any) => {
        const { signedCoverPageUrl } = await getSignedUrlsForBook({
          coverPageUrl: book.coverPageUrl,
          pdfUrl: book.pdfUrl,
        });
        book.coverPageUrl = signedCoverPageUrl;
        return book; // Return bookData with coverPageUrl
      })
    );

    // Construct the author response with books containing signed URLs
    const authorWithSignedUrls = {
      author,
      books: booksWithSignedUrls,
    };

    res.status(200).json(authorWithSignedUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching author", error });
  }
};
