import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "../../lib/utills";
import ReactStars from "react-rating-stars-component";

export type ReviewFormData = {
  text: string;
  rating: number;
};

const ReviewForm = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { bookId } = useParams<{ bookId: string }>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ReviewFormData>();

  const mutation = useMutation(
    (reviewFormData: ReviewFormData) =>
      apiClient.newReview(reviewFormData, bookId!),
    {
      onSuccess: () => {
        showToast({ message: "Review Submitted", type: "SUCCESS" });
        navigate(`/books/${bookId}`);
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    }
  );

  const buttonStyles = cn(
    "w-full text-white py-2 rounded-full font-semibold text-sm sm:text-base",

    isSubmitSuccessful
      ? "bg-gray-400"
      : "bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-600 hover:to-pink-600"
  );

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const ratingChanged = (newRating: number) => {
    setValue("rating", newRating); // Set the rating value in the form
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-gray-900 rounded-lg p-6 shadow-lg mt-48"
    >
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">
          Review
          <textarea
            className=" mt-2 w-full px-3 py-2 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={4}
            {...register("text", { required: "This field cannot be empty" })}
          ></textarea>
        </label>
        {errors.text && (
          <span className="text-pink-500 text-sm">{errors.text.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">
          Rating
          <ReactStars
            count={5}
            onChange={ratingChanged} // Handle rating change
            size={24}
            activeColor="#ffd700"
          />
        </label>
        {errors.rating && (
          <span className="text-pink-500 text-sm">{errors.rating.message}</span>
        )}
      </div>

      <button type="submit" className={buttonStyles}>
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
