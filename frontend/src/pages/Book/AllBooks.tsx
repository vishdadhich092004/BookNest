import { useEffect, useState } from "react";
import { FocusCards } from "../../components/aceternity-ui/focus-cards";
import * as apiClient from "../../api-client";
import { BookType } from "../../../../backend/src/shared/types";
import Loader from "../../components/Loader";
import AuthorFilter from "../../components/Filters/AuthorFilter";
import GenreFilter from "../../components/Filters/GenreFilter";
import UniversalSearchBar from "../../components/Search/UniversalSeachBar";
import Pagination from "../../components/Pagination"; // Import the Pagination component

function BookFocusCards() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genre, setGenre] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(9); // Number of books per page
  const [totalBooks, setTotalBooks] = useState<number>(0);

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const { books: fetchedBooks, totalBooks } =
          await apiClient.fetchBooksWithGenre(genre, author, page, limit);
        setBooks(fetchedBooks);
        setTotalBooks(totalBooks);
        setError(null);

        // Update genres and authors
        const uniqueAuthors = Array.from(
          new Set(fetchedBooks.map((book) => book.author))
        );
        setAuthors(uniqueAuthors);
        const uniqueGenres = Array.from(
          new Set(fetchedBooks.map((book) => book.genre))
        );
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Failed to load books", error);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, [genre, author, page, limit]);

  const totalPages = Math.ceil(totalBooks / limit);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Map books to the card format for FocusCards
  const cards = books.map((book) => ({
    _id: book._id,
    title: book.title,
    src:
      book.coverPageUrl || "https://via.placeholder.com/300x450?text=No+Image",
    description: `By ${book.author}`,
  }));

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-6">
      <div className="mb-8 flex items-center space-x-4">
        <GenreFilter
          genres={genres}
          selectedGenre={genre}
          onGenreChange={setGenre}
        />
        <AuthorFilter
          authors={authors}
          selectedAuthor={author}
          onAuthorChange={setAuthor}
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-10">Books Mania</h1>
      <div className="mb-5">
        <UniversalSearchBar />
      </div>

      {/* Display Book Cards */}
      <FocusCards cards={cards} />

      {/* Pagination Component */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default BookFocusCards;
