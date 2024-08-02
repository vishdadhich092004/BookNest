import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
export type DiscussionData = {
  title: string;
  description: string;
};

function NewDiscussion() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
  } = useForm<DiscussionData>();

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  const buttonStyles = isSubmitSuccessful
    ? "w-full bg-gray-400 text-white py-2 rounded-md"
    : "w-full bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105";

  const mutation = useMutation(apiClient.newDiscussion, {
    onSuccess: () => {
      showToast({
        message: "New Discussion created",
        type: "SUCCESS",
      });
      navigate("/discussions");
    },
    onError: () => {
      showToast({
        message: "Error creating Discussion",
        type: "ERROR",
      });
    },
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <form className="space-y-4" onSubmit={onSubmit}>
          <h2 className="text-3xl font-bold text-center text-indigo-600">
            Create a new Discussion
          </h2>
          <label className="block">
            <span className="text-gray-700">Title</span>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              {...register("title", { required: "Title cannot be empty" })}
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-gray-700">Description</span>
            <textarea
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              {...register("description", {
                required: "This field is required",
              })}
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </label>
          <button type="submit" className={buttonStyles}>
            Create Discussion
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewDiscussion;
