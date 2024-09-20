/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { PlaceholdersAndVanishInput } from "./aceternity-ui/placeholders-and-vanish-input";
import {
  ReviewType,
  BookType,
  ClubType,
  DiscussionType,
  CommentType,
} from "../../../backend/src/shared/types";

export type SearchResultData = {
  books: BookType[];
  reviews: ReviewType[];
  comments: CommentType[];
  discussions: DiscussionType[];
  clubs: ClubType[];
};

const placeholders = [
  "What's the best mystery novel of the decade?",
  "Who wrote 'The Catcher in the Rye'?",
  "Best book clubs to join?",
  "Most discussed books recently?",
  "What are people saying about '1984'?",
];

function UniversalSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return; // Avoid submitting empty query

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data: SearchResultData = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <h1 className="font-bold text-white text-3xl mb-6 text-center">
        Search Anything About Books.
      </h1>
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <PlaceholdersAndVanishInput
          onSubmit={onSubmit}
          className="w-full"
          placeholders={placeholders}
          onChange={handleChange}
        />
      </form>

      {loading && <p className="text-white mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <div className="mt-6 text-white w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          {results.books?.length ? (
            <div>
              <h3 className="text-xl font-semibold">Books</h3>
              {results.books.map((book) => (
                <div key={book._id} className="mb-2">
                  <p className="font-bold">{book.title}</p>
                  <p>{book.description}</p>
                  <p className="italic">By {book.author}</p>
                </div>
              ))}
            </div>
          ) : null}

          {results.clubs?.length ? (
            <div>
              <h3 className="text-xl font-semibold">Clubs</h3>
              {results.clubs.map((club) => (
                <div key={club._id} className="mb-2">
                  <p className="font-bold">{club.title}</p>
                  <p>{club.description}</p>
                </div>
              ))}
            </div>
          ) : null}

          {results.discussions?.length ? (
            <div>
              <h3 className="text-xl font-semibold">Discussions</h3>
              {results.discussions.map((discussion) => (
                <div key={discussion._id} className="mb-2">
                  <p className="font-bold">{discussion.title}</p>
                  <p>{discussion.description}</p>
                </div>
              ))}
            </div>
          ) : null}

          {results.reviews?.length ? (
            <div>
              <h3 className="text-xl font-semibold">Reviews</h3>
              {results.reviews.map((review) => (
                <div key={review._id} className="mb-2">
                  <p>{review.text}</p>
                </div>
              ))}
            </div>
          ) : null}

          {results.comments?.length ? (
            <div>
              <h3 className="text-xl font-semibold">Comments</h3>
              {results.comments.map((comment) => (
                <div key={comment._id} className="mb-2">
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default UniversalSearchBar;
