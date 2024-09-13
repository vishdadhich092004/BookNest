import { useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import { BookType, ReviewType } from "../../../backend/src/shared/types";
import DeleteButton from "../components/Buttons/DeleteButton";
import SingleReview from "./SingleReview";
import Loader from "./Loader";
import { useAuth } from "../contexts/AuthContext";
import PDFViewer from "./PDFViewer/PDFViewer";

Modal.setAppElement("#root"); // Accessibility setting for Modal

function SingleBook() {
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

  if (isLoading) return <Loader />;

  if (isError || !data) {
    navigate("/");
    return (
      <div className="flex justify-center items-center h-screen text-xl text-slate-600">
        404 Not Found
      </div>
    );
  }

  const { title, author, description, coverPageUrl, pdfUrl, reviews, userId } =
    data as BookType;

  const handleBookView = () => setIsBookOpen(true);
  const closeModal = () => setIsBookOpen(false);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row p-6">
          <img
            src={coverPageUrl}
            alt={title}
            className="w-full md:w-1/3 h-80 object-cover rounded-lg"
          />
          <div className="md:ml-6 flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-lg text-gray-600 mb-2">by {author}</p>
            <p className="text-gray-800 mb-4">{description}</p>
            <button
              onClick={handleBookView}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors duration-300 text-sm uppercase tracking-wide"
            >
              View Book
            </button>
            <div className="flex gap-4 mb-6 mt-4">
              <Link
                className="text-teal-600 hover:text-teal-700 transition-colors duration-300"
                to={`/books/${bookId}/reviews`}
              >
                Add Review
              </Link>
              <Link
                className="text-teal-600 hover:text-teal-700 transition-colors duration-300"
                to="/books"
              >
                Back
              </Link>
              {userId.toString() === user?._id.toString() && (
                <DeleteButton id={bookId!} toBeDeleted="books" />
              )}
            </div>
          </div>
        </div>

        {/* Modal for PDF Viewer */}
        <Modal
          isOpen={isBookOpen}
          onRequestClose={closeModal}
          contentLabel="Book PDF Viewer"
          style={{
            content: {
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              padding: "0",
              margin: "0",
              border: "none",
              borderRadius: "0",
              height: "100vh",
              width: "100vw",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
          }}
        >
          <div className="relative h-full w-full">
            <button
              onClick={closeModal}
              className="absolute bg-transparent text-white px-4 py-2 hover:bg-red-700 transition-colors duration-300 z-50"
            >
              Close
            </button>
            <div className="h-full">
              <PDFViewer pdfUrl={pdfUrl} />
            </div>
          </div>
        </Modal>

        {/* Reviews Section */}
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Reviews</h2>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review: ReviewType) => (
                <SingleReview review={review} key={review._id} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleBook;
