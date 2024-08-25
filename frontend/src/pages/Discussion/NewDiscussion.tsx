import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type DiscussionFormData = {
  title: string;
  description: string;
  updatedAt: Date;
  book: string;
};

function NewDiscussion() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
  } = useForm<DiscussionFormData>();

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

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const buttonStyles = isSubmitSuccessful
    ? "w-full bg-slate-400 text-white py-2 rounded-md"
    : "w-full bg-teal-600 text-white py-2 rounded-md shadow-md hover:bg-teal-700 transition-colors duration-300 transform hover:scale-105";

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <form className="space-y-4" onSubmit={onSubmit}>
          <h2 className="text-3xl font-bold text-center text-teal-600">
            Create a New Discussion
          </h2>
          <label className="block">
            <span className="text-slate-800">Title</span>
            <input
              type="text"
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              {...register("title", { required: "Title cannot be empty" })}
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-slate-800">Book</span>
            <input
              type="text"
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              {...register("book", { required: "Book cannot be empty" })}
            />
            {errors.book && (
              <span className="text-red-500 text-sm">
                {errors.book.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-slate-800">Description</span>
            <textarea
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              {...register("description", {
                required: "This field is required",
              })}
              rows={4}
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
