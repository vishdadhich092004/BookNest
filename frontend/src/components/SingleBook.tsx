import { useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import { BookType, ReviewType } from "../../../backend/src/shared/types";
import { useAuth } from "../contexts/AuthContext";
import {
  Book,
  User,
  Star,
  ArrowLeft,
  Trash2,
  Eye,
  X,
  BookOpen,
} from "lucide-react";
import { cn } from "../lib/utills"; // Assuming you have this utility

Modal.setAppElement("#root");

const SingleBook = () => {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleBookView = () => setIsBookOpen(true);
  const closeModal = () => setIsBookOpen(false);

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

        <div className="bg-gray-800 bg-opacity-70  shadow-2xl rounded-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-2/5 h-[400px] md:h-auto overflow-hidden">
              <img
                className="w-full h-full object-cover"
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
              <div className="flex items-center mb-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  {title}
                </h1>
                <User className="mr-3 text-indigo-400" size={24} />
                <p className="text-xl text-gray-300">{author}</p>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {isBookAlreadyRead ? (
                  <button className="bg-gray-700 text-white px-6 py-3 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all duration-300">
                    <Star className="mr-2" size={18} />
                    Already Read
                  </button>
                ) : (
                  <button
                    onClick={() => console.log("Mark as read")}
                    className={cn(
                      "bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full flex items-center shadow-lg",
                      "hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105"
                    )}
                  >
                    <Star className="mr-2" size={18} />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={handleBookView}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
                >
                  <Eye className="mr-2" size={18} />
                  View Book
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
        <div className="mt-12 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg p-8 shadow-2xl">
          <h2 className="text-3xl font-semibold text-white mb-8 flex items-center">
            <BookOpen className="mr-3 text-indigo-400" size={28} />
            Reviews
          </h2>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review: ReviewType) => (
                <div
                  key={review._id}
                  className="bg-gray-700 bg-opacity-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-4 shadow-md">
                      <span className="text-white font-bold text-lg">
                        {review.userId.firstName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {review.userId.firstName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg">
              No reviews yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
      {/* Modal for PDF Viewer */}
      <Modal
        isOpen={isBookOpen}
        onRequestClose={closeModal}
        contentLabel="Book PDF Viewer"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
      >
        <div className="relative w-full h-full max-w-5xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-800 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <X size={24} />
          </button>
          <iframe src={pdfUrl} className="w-full h-full" title="PDF Viewer" />
        </div>
      </Modal>
    </div>
  );
};

export default SingleBook;
