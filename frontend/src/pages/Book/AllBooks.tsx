import { useEffect, useState } from "react";
import * as apiClient from "../../api-client";
import { BookType } from "../../../../backend/src/shared/types";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthContext";

function BooksList() {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooks() {
      try {
        const fetchedBooks = await apiClient.fetchBooks();
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Failed to load books", error);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-6">
      <div className="mb-6">
        <Link
          to={`${isAuthenticated ? "/books/new" : "/sign-in"}`}
          className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Create New Book
        </Link>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Books List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            <img
              src={book.coverPageUrl || "/default-cover.jpg"}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {book.title}
              </h2>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              <p className="text-gray-500 mb-4">{book.genre}</p>
              <p className="text-gray-800 text-sm mb-4">
                {book.description.slice(0, 100)}
                {book.description.length > 100 ? "..." : ""}
              </p>
              <Link
                to={`/books/${book._id}`}
                className="inline-block px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksList;
