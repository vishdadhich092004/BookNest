import { Link } from "react-router-dom";
import { BookType } from "../../../../../server/src/shared/types";

interface BooksTypeProps {
  books: BookType[];
}

const BooksTab = ({ books }: BooksTypeProps) => {
  if (!books) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg p-6 text-center">
        <p className="text-gray-400">No book information available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Link key={book._id} to={`/books/${book._id}`} className="block group">
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/10 transition-all duration-300 h-full flex flex-col">
            <div className="p-6 flex-grow">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                {book.title}
              </h2>
              <p className="text-gray-400 text-sm mb-2">{book.author.name}</p>
              <p className="text-gray-500 text-xs">{book.genre.name}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BooksTab;
