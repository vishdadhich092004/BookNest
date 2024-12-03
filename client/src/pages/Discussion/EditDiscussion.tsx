import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { Save } from "lucide-react";
import { cn } from "../../lib/utills";
import { BookType } from "../../../../server/src/shared/types";

export type EditDiscussionFormData = {
  title: string;
  description: string;
  updatedAt: Date;
  bookId: string | null;
};

const EditDiscussion = () => {
  const { discussionId } = useParams<{ discussionId: string }>();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<EditDiscussionFormData>();

  // Fetch the discussion data
  const { isLoading: isLoadingDiscussion } = useQuery(
    ["discussion", discussionId],
    () => apiClient.fetchDiscussionById(discussionId!),
    {
      enabled: !!discussionId,
      onSuccess: (data) => {
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("bookId", data.bookId?._id || "non-book");
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    }
  );

  // Fetch the list of available books
  const { data: books, isLoading: isLoadingBooks } = useQuery(
    "books",
    apiClient.fetchBooksWithoutGenre
  );

  const mutation = useMutation(
    (editDiscussionFormData: EditDiscussionFormData) =>
      apiClient.updateDiscussion(discussionId!, editDiscussionFormData),
    {
      onSuccess: () => {
        showToast({
          message: "Discussion updated successfully",
          type: "SUCCESS",
        });
        navigate("/discussions");
      },
      onError: () => {
        showToast({ message: "Error updating discussion", type: "ERROR" });
      },
    }
  );

  const onSubmit = handleSubmit((data) => {
    const bookId: string | null =
      data.bookId === "non-book" ? null : data.bookId || null; // Ensure bookId is either string or null
    mutation.mutate({ ...data, bookId, updatedAt: new Date() });
  });

  if (isLoadingDiscussion || isLoadingBooks) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Edit Discussion
          </h1>
        </header>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Title input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className={cn(
                "mt-1 p-3 block w-full rounded-md bg-gray-900 border-gray-700",
                "text-white placeholder-gray-400",
                "focus:ring-purple-500 focus:border-purple-500"
              )}
              placeholder="Enter discussion title"
              {...register("title", { required: "Title cannot be empty" })}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Book selector */}
          <div>
            <label
              htmlFor="book"
              className="block text-sm font-medium text-gray-300"
            >
              Book
            </label>
            <select
              id="bookId"
              className={cn(
                "mt-1 p-3 block w-full rounded-md bg-gray-900 border-gray-700",
                "text-white placeholder-gray-400",
                "focus:ring-purple-500 focus:border-purple-500"
              )}
              {...register("bookId", {
                required: "Please select a book or 'Non-Book' option",
              })}
            >
              <option value="non-book">Non-Book Related</option>
              {books?.map((book: BookType) => (
                <option key={book._id} value={book._id}>
                  {book.title}
                </option>
              ))}
            </select>
            {errors.bookId && (
              <p className="mt-2 text-sm text-red-500">
                {errors.bookId.message}
              </p>
            )}
          </div>

          {/* Description input */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className={cn(
                "mt-1 p-3 block w-full rounded-md bg-gray-900 border-gray-700",
                "text-white placeholder-gray-400",
                "focus:ring-purple-500 focus:border-purple-500"
              )}
              placeholder="Enter discussion description"
              {...register("description", {
                required: "This field is required",
              })}
            ></textarea>
            {errors.description && (
              <p className="mt-2 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={cn(
              "w-full flex items-center justify-center px-4 py-2 border border-transparent",
              "text-sm font-medium rounded-md text-white bg-purple-600",
              "hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2",
              "focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
            )}
          >
            <Save className="mr-2" size={20} />
            Update Discussion
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDiscussion;
