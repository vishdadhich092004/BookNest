import { Link } from "react-router-dom";

type BookCardProps = {
  title: string;
  author: string;
  bookId: string;
};

const BookCard = ({ title, author, bookId }: BookCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <Link
        to={`/books/${bookId}`}
        className="text-lg font-bold text-teal-600 hover:underline"
      >
        {title}
      </Link>
      <p className="text-slate-600 mt-2">by {author}</p>
    </div>
  );
};

export default BookCard;
