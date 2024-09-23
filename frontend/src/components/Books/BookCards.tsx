import { BookType } from "../../../../backend/src/shared/types";

interface FocusBookCardProps {
  book: BookType;
}

const FocusBookCard = ({ book }: FocusBookCardProps) => {
  return {
    title: book.title,
    src:
      book.coverPageUrl || "https://via.placeholder.com/300x450?text=No+Image",
    description: `By ${book.author}`,
    link: `/books/${book._id}`,
  };
};

export default FocusBookCard;
