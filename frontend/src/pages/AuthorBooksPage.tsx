import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import * as apiClient from "../api-client";
import { FocusCards } from "../components/aceternity-ui/focus-cards";
import { BookType, AuthorType } from "../../../backend/src/shared/types";
import Loader from "../components/Loader";
import NoResultCard from "../components/Search/Tabs/NoResultCard";
import NotFound from "./NotFound";

const AuthorBooksPage = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<AuthorType | null>(null);
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { author, books } = await apiClient.fetchAuthorWithBooks(
          authorId!
        );
        setAuthor(author);
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
  }, [authorId]);
  if (loading) return <Loader />;
  if (error) return <NotFound />;

  const cards = books.map((book) => ({
    _id: book._id,
    title: book.title,
    src:
      book.coverPageUrl || "https://via.placeholder.com/300x450?text=No+Image",
    author: `By ${book.author.name}`,
  }));

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
        Books by {author?.name || "Same Author"}
      </h1>

      {books.length === 0 ? (
        <NoResultCard />
      ) : (
        <>
          <FocusCards cards={cards} />
        </>
      )}
    </div>
  );
};

export default AuthorBooksPage;
