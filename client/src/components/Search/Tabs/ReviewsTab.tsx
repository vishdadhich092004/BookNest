import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { ReviewType } from "../../../../../server/src/shared/types";

interface ReviewsTypeProps {
  reviews: ReviewType[];
}

const ReviewsTab = ({ reviews }: ReviewsTypeProps) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
        <p className="text-gray-400">No reviews available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <Link
          to={`/books/${review.bookId}`}
          key={review._id}
          className="block group"
        >
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/10 transition-all duration-300 h-full flex flex-col">
            <div className="p-6 flex-grow">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                Book Review
              </h2>
              <p className="text-gray-300 text-sm line-clamp-3 mb-2">
                {review.text}
              </p>
              <div className="flex items-center text-yellow-500">
                <Star size={16} className="mr-1" />
                <span>{review.rating} / 5</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ReviewsTab;
