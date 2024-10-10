import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { PlusCircle } from "lucide-react";
import { cn } from "../../lib/utills";
import { BookType } from "../../../../backend/src/shared/types";

export type DiscussionFormData = {
  title: string;
  description: string;
  updatedAt: Date;
  bookId: string | null; // Now stores the book ID
};

const NewDiscussion = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<DiscussionFormData>();

  // Fetch the list of available books
  const { data: books } = useQuery("books", apiClient.fetchBooksWithoutGenre); // FetchBooks is an API to get the list of books

  const mutation = useMutation(apiClient.newDiscussion, {
    onSuccess: () => {
      showToast({ message: "New Discussion created", type: "SUCCESS" });
      navigate("/discussions");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    const bookId = data.bookId === "non-book" ? null : data.bookId;
    mutation.mutate({ ...data, bookId });
  });

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Create a New Discussion
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
              defaultValue="non-book"
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
            <PlusCircle className="mr-2" size={20} />
            Create Discussion
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussion;
