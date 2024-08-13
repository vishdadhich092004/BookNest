import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";

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
    formState: { errors, isSubmitSuccessful },
  } = useForm<ReviewFormData>();

  const mutation = useMutation(
    (reviewFormData: ReviewFormData) =>
      apiClient.newReview(reviewFormData, bookId!),
    {
      onSuccess: () => {
        showToast({ message: "Review Successful", type: "SUCCESS" });
        navigate(`/books/${bookId}`);
      },
      onError: () => {
        showToast({ message: "Error submitting review", type: "ERROR" });
      },
    }
  );

  const buttonStyles = isSubmitSuccessful
    ? "w-full bg-gray-400 text-white py-2 rounded-md"
    : "w-full bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105";

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white shadow-md rounded-lg p-6 mt-3"
    >
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Review
          <textarea
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            {...register("text", { required: "This field cannot be empty" })}
          ></textarea>
        </label>
        {errors.text && (
          <span className="text-red-500 text-sm">{errors.text.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Rating
          <select
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("rating", { required: "Rating is required" })}
          >
            <option value="">Select a rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>
        {errors.rating && (
          <span className="text-red-500 text-sm">{errors.rating.message}</span>
        )}
      </div>

      <button type="submit" className={buttonStyles}>
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
