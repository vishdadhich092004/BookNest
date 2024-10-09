import { Star } from "lucide-react";
import { ReviewType } from "../../../../../backend/src/shared/types";

interface ReviewTypeProps {
  review: ReviewType;
}

const ReviewTab = ({ review }: ReviewTypeProps) => {
  if (!review) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg text-center">
        <p className="text-gray-400">No review available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <p className="text-gray-300 mb-2">{review.text}</p>
      <div className="flex items-center text-yellow-500">
        <Star size={16} className="mr-1" />
        <span>{review.rating} / 5</span>
      </div>
    </div>
  );
};

export default ReviewTab;
