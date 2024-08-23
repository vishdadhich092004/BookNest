import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

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
    // console.log(data);
  });

  const buttonStyles = isSubmitSuccessful
    ? "w-full bg-gray-400 text-white py-2 rounded-md"
    : "w-full bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <form className="space-y-4" onSubmit={onSubmit}>
          <h2 className="text-3xl font-bold text-center text-indigo-600">
            Edit Discussion
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
              rows={4}
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-gray-700">Title</span>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              {...register("book", { required: "Book cannot be empty" })}
            />
            {errors.book && (
              <span className="text-red-500 text-sm">
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
