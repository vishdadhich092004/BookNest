import { motion } from "framer-motion";
import { BookType } from "../../../../server/src/shared/types";
import { Link } from "react-router-dom";

interface BooksSectionProps {
  books: BookType[] | [];
}
const BooksSection = ({ books }: BooksSectionProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {books?.map((book) => (
      <motion.div
        key={book._id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
      >
        <Link to={`/books/${book._id}`} className="block p-4">
          <h3 className="text-lg sm:text-xl font-semibold mb-1 group-hover:text-purple-400 transition-colors duration-300">
            {book.title}
          </h3>
          <p className="text-gray-300 text-sm sm:text-base">
            {book.author.name}
          </p>
        </Link>
      </motion.div>
    ))}
  </div>
);

export default BooksSection;
