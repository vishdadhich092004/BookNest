/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { universalSearch } from "../../api-client"; // Import your API client
import ResultTabs from "./ResultTabs"; // Import the new ResultTabs component
import {
  BookType,
  CommentType,
  DiscussionType,
  ReviewType,
  ClubType,
} from "../../../../backend/src/shared/types";

type SearchResults = {
  books: BookType[];
  comments: CommentType[];
  discussions: DiscussionType[];
  reviews: ReviewType[];
  clubs: ClubType[];
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
    <div className="text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mt-4">
        Search Results for "{query}"
      </h1>

      {loading && <p className="text-center text-red-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {results && <ResultTabs results={results} />}

      {!loading && !results && (
        <p className="text-yellow-400 text-center text-xl">
          No results found for "{query}"
        </p>
      )}
    </div>
  );
};

export default SearchResults;
