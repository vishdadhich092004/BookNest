import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import { BookType } from "../../../server/src/shared/types";
import { useAuth } from "../contexts/AuthContext";
import {
  Book,
  ArrowLeft,
  Eye,
  Signature,
  BookmarkPlus,
  Bookmark,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import BookReader from "./Books/BookReader";
import AllReviewsSectionForABook from "./Reviews/AllReviewsSectionForABook";
import DeleteButton from "./Buttons/DeleteButton";
import NotFound from "../pages/NotFound";

const SingleBook = () => {
  const [isBookReaderOpen, setIsBookReaderOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const navigate = useNavigate();
  const { user, refetchUser, isAuthenticated } = useAuth();
  const { showToast } = useAppContext();
  const { bookId } = useParams<{ bookId: string }>();

  const { isLoading, data, isError } = useQuery(
    ["fetchBookById", bookId],
    () => apiClient.fetchBookById(bookId as string),
    {
      onError: () =>
        showToast({ message: "Error fetching book", type: "ERROR" }),
    }
  );

  const markBookAsReadMutation = useMutation(
    () => apiClient.markBookAsRead(bookId!),
    {
      onSuccess: async () => {
        refetchUser();
      },
    }
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <Book className="animate-spin text-indigo-500" size={48} />
      </div>
    );

  if (isError || !data) {
    return <NotFound />;
  }

  const {
    title,
    author,
    description,
    coverPageUrl,
    pdfUrl,
    reviews,
    userId,
    genre,
  } = data as BookType;

  const handleBookRead = () => {
    markBookAsReadMutation.mutate();
  };

  const handleBookView = () => {
    if (isAuthenticated) setIsBookReaderOpen(true);
    else navigate("/sign-in");
  };

  const closeBookReader = () => setIsBookReaderOpen(false);

  const isBookAlreadyRead = user?.readBooks.includes(bookId!);

  const toggleDescription = () =>
    setIsDescriptionExpanded(!isDescriptionExpanded);

  return (
    <div className="min-h-screen text-white pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="bg-gray-900 shadow-2xl rounded-lg overflow-hidden transform hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="flex flex-col lg:flex-row relative">
            <div className="absolute top-4 right-4 z-10">
              <Link
                to={`/genres/${genre._id}`}
                className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white px-6 py-1 rounded-full flex items-center shadow-md hover:from-indigo-500 hover:to-indigo-300 transition-all duration-300 transform hover:scale-105"
              >
                {genre.name}
              </Link>
            </div>
            <div className="relative w-full lg:w-2/5 h-[300px] lg:h-[500px] overflow-hidden">
              <img
                className="w-full h-full object-contain"
                src={coverPageUrl}
                alt={title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>
            <div className="flex-1 p-8 lg:p-12">
              <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
              <div className="flex items-center mb-6">
                <Signature className="mr-2 text-indigo-400" size={20} />
                <Link
                  to={`/authors/${author._id}`}
                  className="text-xl text-gray-300 hover:text-indigo-400 transition-all duration-300"
                >
                  {author.name}
                </Link>
              </div>
              <div className="mb-8">
                <p
                  className={`text-gray-400 leading-relaxed ${
                    isDescriptionExpanded ? "" : "line-clamp-3"
                  }`}
                >
                  {description}
                </p>
                <button
                  onClick={toggleDescription}
                  className="mt-2 text-indigo-400 hover:text-indigo-300 transition-all duration-300 flex items-center"
                >
                  {isDescriptionExpanded ? (
                    <>
                      <ChevronUp size={16} className="mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-1" />
                      Show More
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-4 mb-8">
                {isBookAlreadyRead ? (
                  <button className="bg-gray-700 text-white px-6 py-3 rounded-full flex items-center shadow-md hover:bg-gray-600 transition-all duration-300">
                    <Bookmark className="mr-2" size={18} />
                    Already Read
                  </button>
                ) : (
                  <button
                    onClick={handleBookRead}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white px-6 py-3 rounded-full flex items-center shadow-md hover:from-indigo-500 hover:to-indigo-300 transition-all duration-300 transform hover:scale-105"
                  >
                    <BookmarkPlus className="mr-2" size={18} />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={handleBookView}
                  className="bg-gray-700 text-white px-6 py-3 rounded-full flex items-center shadow-md hover:bg-gray-600 transition-all duration-300"
                >
                  <Eye className="mr-2" size={18} />
                  Start Reading
                </button>
                <Link
                  to={isAuthenticated ? `/books/${bookId}/reviews` : "/sign-in"}
                >
                  <button className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-3 rounded-full shadow-md hover:from-purple-500 hover:to-purple-300 transition-all duration-300">
                    Add Review
                  </button>
                </Link>
                {userId.toString() === user?._id.toString() && (
                  <DeleteButton id={bookId!} toBeDeleted="books" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
          <AllReviewsSectionForABook key={bookId} reviews={reviews} />
        </div>
      </div>

      {isBookReaderOpen && (
        <BookReader pdfUrl={pdfUrl} onClose={closeBookReader} />
      )}
    </div>
  );
};

export default SingleBook;
