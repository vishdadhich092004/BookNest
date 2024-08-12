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
        setError("Error");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  if (loading) {
    return <p>Loading books...</p>;
  }

  if (error) {
    return <p>Error loading books: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="mb-6">
        <Link
          to="/books/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-sm hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105"
        >
          Create new Book
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Books List</h1>
      <ul className="space-y-4">
        {books.map((book) => (
          <li
            key={book._id}
            className="border p-4 rounded-lg shadow flex flex-col md:flex-row"
          >
            <img
              src={book.coverPageUrl}
              alt={`${book.title} cover`}
              className="w-full md:w-32 h-48 object-cover rounded-md mb-4 md:mb-0 md:mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">by {book.author}</p>
              <p className="text-gray-800">{book.description}</p>
              <p className="text-gray-600">Genre: {book.genre}</p>
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Read PDF
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BooksList;
