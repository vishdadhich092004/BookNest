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
        showToast({ message: "Comment Successful", type: "SUCCESS" });
        navigate(`/discussions/${discussionId}`);
      },
      onError: () => {
        showToast({ message: "Error commenting", type: "ERROR" });
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
          Comment
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
      <button type="submit" className={buttonStyles}>
        Comment
      </button>
    </form>
  );
};

export default CommentForm;
