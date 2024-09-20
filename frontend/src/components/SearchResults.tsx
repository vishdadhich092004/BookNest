import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);

  // Extract query from the URL
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (query) {
      // Fetch search results from the backend (use an API call)
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error("Error fetching search results:", err));
    }
  }, [query]);

  return (
    <div>
      <h2>Search Results for: "{query}"</h2>
      <div>
        {results.length ? (
          <ul>
            {results.map((result) => (
              <li key={result.id}>{result.title}</li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
