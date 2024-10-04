/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { universalSearch } from "../../api-client";
import ResultTabs from "./ResultTabs";
import {
  BookType,
  CommentType,
  DiscussionType,
  ReviewType,
  ClubType,
} from "../../../../backend/src/shared/types";
import { cn } from "../../lib/utills"; // Assuming you have this utility
import Loader from "../Loader";

type SearchResults = {
  books: BookType[];
  comments: CommentType[];
  discussions: DiscussionType[];
  reviews: ReviewType[];
  clubs: ClubType[];
};

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
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
  }, [query]);

  return (
    <div className="bg-black bg-opacity-90 text-white min-h-screen p-6">
      <h1
        className={cn(
          "text-4xl font-bold text-center mt-8 mb-6",
          "text-white "
        )}
      >
        What we found for <span className="italic">{query}</span>
      </h1>

      {loading && (
        <p className="text-center text-white text-xl animate-pulse mb-6">
          <Loader />
        </p>
      )}

      {error && (
        <p className="text-center text-white bg-red-900 bg-opacity-20 p-4 rounded-lg mb-6">
          {error}
        </p>
      )}

      {results && <ResultTabs results={results} />}

      {!loading && !results && (
        <p className="text-white text-center text-xl p-4 bg-yellow-900 bg-opacity-20 rounded-lg mb-6">
          No results found for "{query}"
        </p>
      )}
    </div>
  );
};

export default SearchResults;
