import { BookType } from "../../../../../backend/src/shared/types";
// import { BentoGridDemo } from "../../Grid/BentoGrid";

interface BooksTabProps {
  books: BookType[];
}

function BooksTab({ books }: BooksTabProps) {
  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg">
      {books.length > 0 ? (
        <ul className="space-y-4">
          {books.map((book, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <strong className="text-cyan-400">Title:</strong> {book.title}
              <br />
              <strong className="text-cyan-400">Description:</strong>{" "}
              {book.description}
              <br />
              <strong className="text-cyan-400">Author:</strong> {book.author}
              <br />
              <strong className="text-cyan-400">Genre:</strong> {book.genre}
            </li>
          ))}
        </ul>
      ) : (
        <p>No books found.</p>
      )}
      {/* <BentoGridDemo /> */}
    </div>
  );
}

export default BooksTab;
