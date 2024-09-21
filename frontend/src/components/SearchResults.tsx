/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { universalSearch } from "../api-client"; // Import your API client

type SearchResults = {
  books: Array<{
    title: string;
    description: string;
    author: string;
    genre: string;
  }>;
  comments: Array<{ text: string }>;
  discussions: Array<{ title: string; description: string }>;
  reviews: Array<{ text: string }>;
  clubs: Array<{ title: string; description: string }>;
};

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams(); // React Router hook to get query params
  const query = searchParams.get("q"); // Get the 'q' parameter
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setLoading(true);
        try {
          const data = await universalSearch(query);
          setResults(data);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [query]); // Fetch results whenever 'query' changes

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Search Results for "{query}"
      </h1>

      {loading && <p className="text-center text-red-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {results && (
        <div className="space-y-8">
          {/* Books Section */}
          {results.books.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Books</h3>
              <ul className="space-y-4">
                {results.books.map((book, index) => (
                  <li
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <strong className="text-cyan-400">Title:</strong>{" "}
                    {book.title}
                    <br />
                    <strong className="text-cyan-400">Description:</strong>{" "}
                    {book.description}
                    <br />
                    <strong className="text-cyan-400">Author:</strong>{" "}
                    {book.author}
                    <br />
                    <strong className="text-cyan-400">Genre:</strong>{" "}
                    {book.genre}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Discussions Section */}
          {results.discussions.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Discussions</h3>
              <ul className="space-y-4">
                {results.discussions.map((discussion, index) => (
                  <li
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <strong className="text-cyan-400">Title:</strong>{" "}
                    {discussion.title}
                    <br />
                    <strong className="text-cyan-400">Description:</strong>{" "}
                    {discussion.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Clubs Section */}
          {results.clubs.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Clubs</h3>
              <ul className="space-y-4">
                {results.clubs.map((club, index) => (
                  <li
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <strong className="text-cyan-400">Title:</strong>{" "}
                    {club.title}
                    <br />
                    <strong className="text-cyan-400">Description:</strong>{" "}
                    {club.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Comments Section */}
          {results.comments.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Comments</h3>
              <ul className="space-y-4">
                {results.comments.map((comment, index) => (
                  <li
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <strong className="text-cyan-400">Comment:</strong>{" "}
                    {comment.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews Section */}
          {results.reviews.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
              <ul className="space-y-4">
                {results.reviews.map((review, index) => (
                  <li
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <strong className="text-cyan-400">Review:</strong>{" "}
                    {review.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No Results */}
          {Object.values(results).every((r) => r.length === 0) && (
            <p className="text-yellow-400 text-center text-xl mt-8">
              No results found for "{query}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
