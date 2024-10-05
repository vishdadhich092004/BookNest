import { ReviewType } from "../../../../backend/src/shared/types";

interface SingleReviewComponentProps {
  review: ReviewType;
}
function SingleReviewComponent({ review }: SingleReviewComponentProps) {
  return (
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
          <p className="font-semibold text-lg">{review.userId.firstName}</p>
          <p className="text-sm text-gray-400">
            {new Date(review.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed">{review.text}</p>
    </div>
  );
}

export default SingleReviewComponent;
