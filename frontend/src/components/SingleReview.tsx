import { ReviewType } from "../../../backend/src/shared/types";

type SingleReviewType = {
  review: ReviewType;
};

function SingleReview({ review }: SingleReviewType) {
  // Function to render stars based on the rating
  const renderStars = (rating: number) => {
    const totalStars = 5; // Total number of stars
    const filledStars = Math.round(rating); // Number of filled stars based on rating

    return Array.from({ length: totalStars }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < filledStars ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-4">
      <p className="text-slate-800 mb-2">{review.text}</p>
      <div className="text-sm text-slate-600 mt-2 flex items-center">
        <p className="mr-2">
          <span className="font-semibold">Reviewed by:</span>{" "}
          {review.userId ? review.userId.firstName : "[deleted]"}
        </p>
        <div className="flex items-center">{renderStars(review.rating)}</div>
      </div>
    </div>
  );
}

export default SingleReview;
