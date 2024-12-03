import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";

export type CommentFormData = {
  text: string;
};

const CommentForm = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { discussionId } = useParams<{ discussionId: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CommentFormData>();

  const mutation = useMutation(
    (commentFormData: CommentFormData) =>
      apiClient.newComment(commentFormData, discussionId!),
    {
      onSuccess: () => {
        showToast({ message: "Comment Submitted", type: "SUCCESS" });
        navigate(`/discussions/${discussionId}`);
      },
      onError: () => {
        showToast({ message: "Error commenting", type: "ERROR" });
      },
    }
  );

  const buttonStyles = isSubmitSuccessful
    ? "w-full bg-gray-600 text-gray-300 py-2 rounded-md cursor-not-allowed"
    : "w-full bg-purple-600 text-white py-2 rounded-md shadow-md hover:bg-purple-700 transition-all duration-300 transform hover:scale-105";

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-md">
        <form
          onSubmit={onSubmit}
          className="bg-gray-900 shadow-md rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Add Comment</h2>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Your Comment
              <textarea
                className="w-full px-3 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-1"
                rows={4}
                {...register("text", {
                  required: "This field cannot be empty",
                })}
              ></textarea>
            </label>
            {errors.text && (
              <span className="text-red-400 text-sm">
                {errors.text.message}
              </span>
            )}
          </div>
          <button type="submit" className={buttonStyles}>
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentForm;
