import { ReviewType } from "../../../../server/src/shared/types";
import timeAgo from "../../utils/timeAgo";
import ReactStars from "react-rating-stars-component"; // Import the stars component
import UserDisplay from "../UserDisplay";

interface SingleReviewComponentProps {
  review: ReviewType;
}

function SingleReviewComponent({ review }: SingleReviewComponentProps) {
  return (
    <div
      key={review._id}
      className="bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
    >
      <div className="flex items-center mb-4">
        <UserDisplay user={review.userId} />
      </div>
      <p className="text-sm text-gray-400 ml-14 -mt-6">
        {timeAgo(new Date(review.createdAt))}
      </p>
      <p className="text-gray-300 leading-relaxed">{review.text}</p>
      <div className="mt-4 flex items-center">
        <span className="text-purple-400 font-semibold mr-2">Rating:</span>
        <ReactStars
          count={5}
          value={review.rating}
          size={24}
          activeColor="#ffd700"
          edit={false} // Prevent editing on review display
        />
      </div>
    </div>
  );
}

export default SingleReviewComponent;
