import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import { BookType, ReviewType } from "../../../backend/src/shared/types";
import DeleteButton from "../components/Buttons/DeleteButton";
import SingleReview from "./SingleReview";
import Loader from "./Loader";
import { useAuth } from "../contexts/AuthContext";

function SingleBook() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useAppContext();
  const { bookId } = useParams<{ bookId: string }>();

  const { isLoading, data, isError } = useQuery(
    ["fetchBookById", bookId],
    () => apiClient.fetchBookById(bookId as string),
    {
      onError: () => {
        showToast({ message: "Error fetching book", type: "ERROR" });
      },
    }
  );

  if (isLoading) {
    return <Loader />;
  }

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
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 transition-colors duration-300 block mb-4"
            >
              Read PDF
            </a>
            <div className="flex gap-4 mb-6">
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
