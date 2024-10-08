import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";

export type EditDiscussionFormData = {
  title: string;
  description: string;
  updatedAt: Date;
  book: string;
};

function EditDiscussion() {
  const { showToast } = useAppContext();
  const { discussionId } = useParams<{ discussionId: string }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<EditDiscussionFormData>();

  useEffect(() => {
    const fetchDiscussion = async () => {
      if (discussionId) {
        try {
          const fetchedDiscussion = await apiClient.fetchDiscussionById(
            discussionId
          );
          setValue("title", fetchedDiscussion.title);
          setValue("description", fetchedDiscussion.description);
          setValue("book", fetchedDiscussion.book);
          setValue("updatedAt", new Date());
        } catch (e) {
          console.error("Error fetching discussion", e);
        }
      }
    };
    fetchDiscussion();
  }, [discussionId, setValue]);

  const mutation = useMutation(
    (editDiscussionFormData: EditDiscussionFormData) =>
      apiClient.updateDiscussion(discussionId!, editDiscussionFormData),
    {
      onSuccess: () => {
        showToast({ message: "Update Successful", type: "SUCCESS" });
        navigate(`/discussions/${discussionId}`);
      },
      onError: (e) => {
        console.log("Error updating discussion", e);
      },
    }
  );

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const buttonStyles = isSubmitSuccessful
    ? "w-full bg-gray-600 text-gray-300 py-2 rounded-md cursor-not-allowed"
    : "w-full bg-purple-600 text-white py-2 rounded-md shadow-md hover:bg-purple-700 transition-all duration-300 transform hover:scale-105";

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <form className="space-y-4" onSubmit={onSubmit}>
          <h2 className="text-3xl font-bold text-center text-purple-400">
            Edit Discussion
          </h2>
          <label className="block">
            <span className="text-gray-300">Title</span>
            <input
              type="text"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 text-gray-300 p-3"
              {...register("title", { required: "Title cannot be empty" })}
            />
            {errors.title && (
              <span className="text-red-400 text-sm">
                {errors.title.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-gray-300">Description</span>
            <textarea
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 text-gray-300 p-3"
              {...register("description", {
                required: "This field is required",
              })}
              rows={4}
            ></textarea>
            {errors.description && (
              <span className="text-red-400 text-sm">
                {errors.description.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-gray-300">Book</span>
            <input
              type="text"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 text-gray-300 p-3"
              {...register("book", { required: "Book cannot be empty" })}
            />
            {errors.book && (
              <span className="text-red-400 text-sm">
                {errors.book.message}
              </span>
            )}
          </label>
          <button type="submit" className={buttonStyles}>
            Update Discussion
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditDiscussion;
