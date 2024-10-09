/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { PlaceholdersAndVanishInput } from "../aceternity-ui/placeholders-and-vanish-input";
import { useNavigate } from "react-router-dom";

const placeholders = [
  "To Kill a Mockingbird",
  "Fiction",
  "Romance",
  "Harper Lee",
  "Dystopian",
  "The Great Gatsby",
  "Classic",
  "Pride and Prejudice",
  "Jane Austen",
  "Literary Fiction",
];

interface UniversalSearchBarProps {
  className?: string; // Optional className prop
}

function UniversalSearchBar({ className = "" }: UniversalSearchBarProps) {
  const [query, setQuery] = useState<string>(""); // State for the search query
  const navigate = useNavigate(); // useNavigate for programmatic navigation

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      // Introduce a delay of 500 milliseconds
      setTimeout(() => {
        navigate(`/search-results?q=${query}`); // Navigate to SearchResultsPage with query
      }, 500);
    }
  };

  return (
    <div className={`flex flex-col items-center lg:mt-8  px-4 ${className}`}>
      <PlaceholdersAndVanishInput
        onSubmit={handleSearch}
        className="w-full"
        placeholders={placeholders}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default UniversalSearchBar;
