import { useEffect, useState } from "react";
import * as apiClient from "../../api-client";
import { BookType } from "../../../../backend/src/shared/types";
import { Link } from "react-router-dom";

function BooksList() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooks() {
      try {
        const fetchedBooks = await apiClient.fetchBooks();
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Failed to load books", error); // Log the actual error
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-600">
        {/* Optionally replace with a skeleton loader */}
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-6">
      <div className="mb-6">
        <Link
          to="/books/new"
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Create New Book
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Books List</h1>
      <ul className="space-y-4">
        {books.map((book) => (
          <li
            key={book._id}
            className="border border-slate-200 p-4 rounded-lg shadow-md bg-white"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              {book.title}
            </h2>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-gray-800 mt-2">{book.description}</p>
            <div className="mt-4">
              <Link
                to={`/books/${book._id}`}
                className="px-4 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                View Details
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BooksList;
