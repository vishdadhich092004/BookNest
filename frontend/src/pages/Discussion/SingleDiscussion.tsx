import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";
import {
  DiscussionType,
  CommentType,
} from "../../../../backend/src/shared/types";
import DeleteButton from "../../components/DeleteButton";

function SingleDiscussion() {
  const { showToast } = useAppContext();
  const { id } = useParams<{ id: string }>(); // Get the ID from the route params

  const { isLoading, data, isError } = useQuery(
    ["fetchDiscussionById", id],
    () => apiClient.fetchDiscussionById(id as string), // Ensure the ID is passed as a string
    {
      onError: () => {
        showToast({ message: "Error fetching discussion", type: "ERROR" });
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-800">
        Loading...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-800">
        404 Not Found
      </div>
    );
  }

  const { title, description, createdBy, createdAt, updatedAt, comments } =
    data as DiscussionType;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <div className="flex justify-between mb-4">
          <p className="text-gray-600">{description}</p>
          <Link
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
            to={`/discussions/${id}/edit`}
          >
            Edit Discussion
          </Link>
        </div>
        <div className="text-sm text-gray-500 mb-6">
          <p>
            <span className="font-semibold">Created by:</span> {createdBy}
          </p>
          <p>
            <span className="font-semibold">Created at:</span>{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Updated at:</span>{" "}
            {new Date(updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex justify-between mb-6">
          <Link
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
            to={`/discussions/${id}/comments`}
          >
            New Comment
          </Link>
          <Link
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
            to="/discussions"
          >
            Back
          </Link>
          <DeleteButton id={id!} toBeDeleted="discussions" />
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Comments
          </h2>
          {comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment: CommentType) => (
                <div key={comment._id} className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700">{comment.text}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    <p>
                      <span className="font-semibold">Commented by:</span>{" "}
                      {comment.user}
                    </p>
                    <p>
                      <span className="font-semibold">On:</span>{" "}
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Likes:</span>{" "}
                      {comment.likes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleDiscussion;
