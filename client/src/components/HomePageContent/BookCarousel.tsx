import { useQuery } from "react-query";
import { Carousel, Card } from "../aceternity-ui/apple-cards-carousel";
import BookCardHome from "../BookCardHome";
import * as apiClient from "../../api-client";
import Loader from "../Loader";
import { BookType } from "../../../../server/src/shared/types";

function BooksCarousel() {
  const { data: allBooks, isLoading } = useQuery(
    "fetchBooksWithoutGenre",
    apiClient.fetchBooksWithoutGenre
  );
  if (isLoading) return <Loader />;

  const transformedBooks = allBooks?.map((book: BookType) => ({
    category: book.genre.name || "Unknown", // Use a default value if genre is not available
    title: book.title,
    src: book.coverPageUrl || "",
    content: <BookCardHome book={book} />, // Use a default value if coverImgUrl is not available
  }));

  const books = transformedBooks?.map((book, index) => (
    <Card key={book.title} card={book} index={index} />
  ));

  return (
    <div className="w-full h-full">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-white font-sans">
        Explore Our Book Recommendations
      </h2>
      <Carousel items={books!} />
    </div>
  );
}

export default BooksCarousel;
