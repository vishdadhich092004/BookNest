import { MessageCircleCode } from "lucide-react";
import { ReviewType } from "../../../../backend/src/shared/types";
import SingleReviewComponent from "./SingleReviewComponent";
interface AllReviewsSectionForABookProps {
  reviews: ReviewType[];
}

function AllReviewsSectionForABook({
  reviews,
}: AllReviewsSectionForABookProps) {
  return (
    <div className="mt-12 bg-black bg-opacity-70 backdrop-blur-md rounded-lg p-8 shadow-2xl">
      <h2 className="text-3xl font-semibold text-white mb-8 flex items-center">
        <MessageCircleCode className="mr-3 text-indigo-400" size={28} />
        Reviews
      </h2>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review: ReviewType) => (
            <SingleReviewComponent key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg">
          No reviews yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
}

export default AllReviewsSectionForABook;
