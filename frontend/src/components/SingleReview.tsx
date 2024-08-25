import { ReviewType } from "../../../backend/src/shared/types";

type SingleReviewType = {
  review: ReviewType;
};

function SingleReview({ review }: SingleReviewType) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <p className="text-gray-700">{review.text}</p>
      <div className="text-sm text-gray-500 mt-2">
        <p>
          <span className="font-semibold">Reviewed by:</span>{" "}
          {review.userId ? review.userId.firstName : "[deleted]"}
        </p>
        <p>
          <span className="font-semibold">Rating:</span> {review.rating}
        </p>
        <p>
          <span className="font-semibold">On:</span>{" "}
          {/* {new Date(review.timestamp).toLocaleDateString()} */}
        </p>
      </div>
    </div>
  );
}

export default SingleReview;
