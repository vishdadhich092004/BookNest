/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { PlaceholdersAndVanishInput } from "../aceternity-ui/placeholders-and-vanish-input";
import { useNavigate } from "react-router-dom";

const placeholders = [
  "What's the best mystery novel of the decade?",
  "Who wrote 'The Catcher in the Rye'?",
  "Most discussed books recently?",
  "What are people saying about '1984'?",
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
