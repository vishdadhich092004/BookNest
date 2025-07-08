import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import * as apiClient from "../../api-client";
import { FocusCards } from "../../components/aceternity-ui/focus-cards";
import Loader from "../../components/Loader";
import NoResultCard from "../../components/Search/Tabs/NoResultCard";
import NotFound from "../NotFound";
import { BookType, GenreType } from "../../../../server/src/shared/types";

const GenreBooksPage = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [genre, setGenre] = useState<GenreType | null>(null);
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { genre, books } = await apiClient.fetchGenreWithBooks(genreId!);
        setGenre(genre);
        setBooks(books);
        setError(null);
      } catch (error) {
        console.error("Failed to load data", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [genreId]);
  if (loading) return <Loader />;
  if (error) return <NotFound />;

  const cards = books.map((book) => ({
    _id: book._id,
    title: book.title,
    src:
      book.coverPageUrl || "https://via.placeholder.com/300x450?text=No+Image",
  }));

  console.log(books);
  return (
    <div className="max-w-7xl mx-auto mt-8 px-6">
      <Link
        to="/books"
        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-all duration-300 mb-8 group"
      >
        <ArrowLeft
          className="mr-2 group-hover:-translate-x-1 transition-transform duration-300"
          size={20}
        />
        <span className="text-lg font-medium">Back to Books</span>
      </Link>

      <h1 className="text-4xl font-bold text-white mb-10">
        {genre?.name || "Similar"} Books
      </h1>

      {books.length === 0 ? (
        <NoResultCard />
      ) : (
        <>
          <FocusCards key={genreId} cards={cards} />
        </>
      )}
    </div>
  );
};

export default GenreBooksPage;
