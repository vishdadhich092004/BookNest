import { ReviewType } from "../../../../../backend/src/shared/types";

interface ReviewsTabProps {
  reviews: ReviewType[];
}
function ReviewsTab({ reviews }: ReviewsTabProps) {
  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg">
      {reviews.length > 0 ? (
        <ul className="space-y-4">
          {reviews.map((review, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <strong className="text-cyan-400">Review:</strong> {review.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
}

export default ReviewsTab;
