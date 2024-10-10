import { useEffect, useState } from "react";
import { FocusCards } from "../../components/aceternity-ui/focus-cards";
import * as apiClient from "../../api-client";
import {
  BookType,
  GenreType,
  AuthorType,
} from "../../../../backend/src/shared/types";
import Loader from "../../components/Loader";
import AuthorFilter from "../../components/Filters/AuthorFilter";
import GenreFilter from "../../components/Filters/GenreFilter";
import UniversalSearchBar from "../../components/Search/UniversalSeachBar";
import Pagination from "../../components/Pagination";
import NoResultCard from "../../components/Search/Tabs/NoResultCard";
import NotFound from "../NotFound";

function BookFocusCards() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [authors, setAuthors] = useState<AuthorType[]>([]);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(9); // Number of books per page
  const [totalBooks, setTotalBooks] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [genresData, authorsData] = await Promise.all([
          apiClient.fetchAllGenres(),
          apiClient.fetchAllAuthors(),
        ]);
        setGenres(genresData);
        setAuthors(authorsData);

        const { books: fetchedBooks, totalBooks } =
          await apiClient.fetchBooksWithGenre(
            selectedGenre,
            selectedAuthor,
            page,
            limit
          );
        setBooks(fetchedBooks);
        setTotalBooks(totalBooks);
        setError(null);
      } catch (error) {
        console.error("Failed to load data", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedGenre, selectedAuthor, page, limit]);

  const totalPages = Math.ceil(totalBooks / limit);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleGenreChange = (genreId: string) => {
    setSelectedGenre(genreId);
    setPage(1); // Reset to first page when changing filters
  };

  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthor(authorId);
    setPage(1); // Reset to first page when changing filters
  };

  // Map books to the card format for FocusCards
  const cards = books.map((book) => ({
    _id: book._id,
    title: book.title,
    src:
      book.coverPageUrl || "https://via.placeholder.com/300x450?text=No+Image",
    author: `By ${book.author}`,
  }));

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-6">
      <div className="mb-8 flex items-center space-x-4">
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
        />
        <AuthorFilter
          authors={authors}
          selectedAuthor={selectedAuthor}
          onAuthorChange={handleAuthorChange}
        />
      </div>

      <h1 className="text-4xl font-bold text-white mb-10">Books Mania</h1>
      <div className="mb-5">
        <UniversalSearchBar />
      </div>

      {books.length === 0 ? (
        <NoResultCard />
      ) : (
        <>
          <FocusCards cards={cards} />
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default BookFocusCards;
