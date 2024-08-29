import { Link } from "react-router-dom";
import { BookType } from "../../../backend/src/shared/types";
type BookProps = {
  book: BookType;
};
function Book({ book }: BookProps) {
  return (
    <div className=" bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <img
        src={book.coverPageUrl}
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
          className=" px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default Book;
