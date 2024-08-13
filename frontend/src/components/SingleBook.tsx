import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import { BookType, ReviewType } from "../../../backend/src/shared/types";
import DeleteButton from "./DeleteButton";
import SingleReview from "./SingleReview";

function SingleBook() {
  const { showToast } = useAppContext();
  const { bookId } = useParams<{ bookId: string }>(); // Get the ID from the route params

  const { isLoading, data, isError } = useQuery(
    ["fetchBookById", bookId],
    () => apiClient.fetchBookById(bookId as string), // Ensure the ID is passed as a string
    {
      onError: () => {
        showToast({ message: "Error fetching book", type: "ERROR" });
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-800">
        Loading...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-800">
        404 Not Found
      </div>
    );
  }

  const { title, author, description, coverPageUrl, pdfUrl, reviews } =
    data as BookType;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <div className="flex justify-between mb-4">
          <p className="text-gray-600">by {author}</p>
          <Link
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
            to={`/books/${bookId}/edit`}
          >
            Edit Book
          </Link>
        </div>
        <p className="text-gray-800 mb-4">{description}</p>
        <img
          src={coverPageUrl}
          alt={title}
          className="w-32 h-48 object-cover mt-2"
        />
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 block mt-2"
        >
          Read PDF
        </a>
        <div className="flex justify-between mb-6 mt-6">
          <Link
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
            to={`/books/${bookId}/reviews`}
          >
            Add Review
          </Link>
          <Link
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
            to="/books"
          >
            Back
          </Link>
          <DeleteButton id={bookId!} toBeDeleted="books" />
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
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
