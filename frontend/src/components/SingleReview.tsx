import { ReviewType } from "../../../backend/src/shared/types";

type SingleReviewType = {
  review: ReviewType;
};

function SingleReview({ review }: SingleReviewType) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-4">
      <p className="text-slate-800">{review.text}</p>
      <div className="text-sm text-slate-600 mt-2">
        <p>
          <span className="font-semibold">Reviewed by:</span>{" "}
          {review.userId ? review.userId.firstName : "[deleted]"}
        </p>
        <p>
          <span className="font-semibold">Rating:</span> {review.rating}
        </p>
        {/* <p>
          <span className="font-semibold">On:</span>{" "}
          {new Date(review.timestamp).toLocaleDateString()}
        </p> */}
      </div>
    </div>
  );
}

export default SingleReview;
