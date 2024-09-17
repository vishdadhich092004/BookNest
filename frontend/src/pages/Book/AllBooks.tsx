import { useEffect, useState } from "react";
import * as apiClient from "../../api-client";
import { BookType } from "../../../../backend/src/shared/types";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthContext";
import Book from "../../components/Book";
const adminId = import.meta.env.VITE_ADMIN_ID;

function BooksList() {
  const { isAuthenticated, user } = useAuth();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genre, setGenre] = useState<string>(""); // State for selected genre
  const [author, setAuthor] = useState<string>(""); // State for selected author
  const [genres, setGenres] = useState<string[]>([]); // Sample genres - modify as needed
  const [authors, setAuthors] = useState<string[]>([]); // State for authors

  // Fetch books based on the selected genre and author
  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const fetchedBooks = await apiClient.fetchBooksWithGenre(genre, author); // Fetch books with genre and author filters
        setBooks(fetchedBooks);
        setError(null); // Reset error on successful fetch

        // Extract unique authors from the fetched books
        const uniqueAuthors = Array.from(
          new Set(fetchedBooks.map((book) => book.author))
        );
        setAuthors(uniqueAuthors); // Set authors for dropdown
        const uniqueGenres = Array.from(
          new Set(fetchedBooks.map((book) => book.genre))
        );
        setGenres(uniqueGenres); // Set authors for dropdown
      } catch (error) {
        console.error("Failed to load books", error);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, [genre, author]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const isAdmin = isAuthenticated && user?._id.toString() === adminId;
  return (
    <div className="max-w-5xl mx-auto mt-8 px-6">
      {/* Genre and Author Filters */}
      <div className="mb-6 flex items-center space-x-4">
        {/* Genre Dropdown */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Author Dropdown */}
        <select
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Authors</option>
          {authors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {isAdmin && (
          <Link
            to="/books/new"
            className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Create New Book
          </Link>
        )}
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Books List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Book key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default BooksList;
