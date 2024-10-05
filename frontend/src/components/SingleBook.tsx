import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import { BookType } from "../../../backend/src/shared/types";
import { useAuth } from "../contexts/AuthContext";
import {
  Book,
  ArrowLeft,
  Trash2,
  Eye,
  Signature,
  BookmarkPlus,
  Bookmark,
} from "lucide-react";
import { cn } from "../lib/utills";
import BookReader from "./Books/BookReader";
import AllReviewsSectionForABook from "./Reviews/AllReviewsSectionForABook";

const SingleBook: React.FC = () => {
  const [isBookReaderOpen, setIsBookReaderOpen] = useState(false);
  const navigate = useNavigate();
  const { user, refetchUser } = useAuth();
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
    navigate("/");
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black text-xl text-gray-400">
        404 Not Found
      </div>
    );
  }

  const { title, author, description, coverPageUrl, pdfUrl, reviews, userId } =
    data as BookType;

  const handleBookRead = () => {
    markBookAsReadMutation.mutate();
  };

  const handleBookView = () => setIsBookReaderOpen(true);
  const closeBookReader = () => setIsBookReaderOpen(false);

  const isBookAlreadyRead = user?.readBooks.includes(bookId!);

  return (
    <div className="min-h-screen text-white pt-16">
      <div className="container mx-auto px-6">
        <Link
          to="/books"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-all duration-300 mb-6 group"
        >
          <ArrowLeft
            className="mr-2 group-hover:-translate-x-1 transition-transform duration-300"
            size={20}
          />
          <span className="text-lg font-medium">Back</span>
        </Link>

        <div className="bg-gray-800 bg-opacity-70 shadow-2xl rounded-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-2/5 h-[300px] md:h-[400px] overflow-hidden">
              <img
                className="w-full h-full object-contain"
                src={coverPageUrl}
                alt={title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent flex items-end p-6">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  {title}
                </h1>
              </div>
            </div>
            <div className="flex-1 p-8">
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                  {title}
                </h1>
                <div className="flex items-center">
                  <Signature className="mr-2 text-indigo-400" size={20} />
                  <p className="text-xl text-gray-300">{author}</p>
                </div>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {isBookAlreadyRead ? (
                  <button className="bg-gray-700 text-white px-6 py-3 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all duration-300">
                    <Bookmark className="mr-2" size={18} />
                    Already Read
                  </button>
                ) : (
                  <button
                    onClick={handleBookRead}
                    className={cn(
                      "bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full flex items-center shadow-lg",
                      "hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105"
                    )}
                  >
                    <BookmarkPlus className="mr-2" size={18} />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={handleBookView}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
                >
                  <Eye className="mr-2" size={18} />
                  Start Reading Book
                </button>
                <Link to={`/books/${bookId}/reviews`}>
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-300">
                    Add Review
                  </button>
                </Link>
                {userId.toString() === user?._id.toString() && (
                  <button
                    onClick={() => console.log("Delete book")}
                    className="bg-red-600 text-white px-6 py-3 rounded-full flex items-center shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300"
                  >
                    <Trash2 className="mr-2" size={18} />
                    Delete Book
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <AllReviewsSectionForABook reviews={reviews} />
      </div>

      {/* BookReader Component */}
      {isBookReaderOpen && (
        <BookReader pdfUrl={pdfUrl} onClose={closeBookReader} />
      )}
    </div>
  );
};

export default SingleBook;
