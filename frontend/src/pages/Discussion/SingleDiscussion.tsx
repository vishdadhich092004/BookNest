import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";
import {
  DiscussionType,
  CommentType,
} from "../../../../backend/src/shared/types";
import DeleteButton from "../../components/Buttons/DeleteButton";
import SingleComment from "../../components/SingleComment";
import LikeButton from "../../components/Buttons/LikeButton";
import DislikeButton from "../../components/Buttons/DislikeButton";

function SingleDiscussion() {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const { discussionId } = useParams<{ discussionId: string }>();

  // Query for fetching the discussion data
  const { data, isLoading, isError } = useQuery(
    ["fetchDiscussionById", discussionId],
    () => apiClient.fetchDiscussionById(discussionId as string),
    {
      onError: () => {
        showToast({ message: "Error fetching discussion", type: "ERROR" });
      },
    }
  );

  // Mutation for liking a discussion
  const likeMutation = useMutation(
    () => apiClient.likeDiscussion(discussionId!),
    {
      onSuccess: async () => {
        // Invalidate and refetch the discussion data
        await queryClient.invalidateQueries([
          "fetchDiscussionById",
          discussionId,
        ]);
      },
      onError: () => {
        showToast({ message: "Already liked", type: "ERROR" });
      },
    }
  );

  // Mutation for disliking a discussion
  const dislikeMutation = useMutation(
    () => apiClient.dislikeDiscussion(discussionId!),
    {
      onSuccess: async () => {
        // Invalidate and refetch the discussion data
        await queryClient.invalidateQueries([
          "fetchDiscussionById",
          discussionId,
        ]);
      },
      onError: () => {
        showToast({
          message: "Already disliked",
          type: "ERROR",
        });
      },
    }
  );

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleDislike = () => {
    dislikeMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-slate-800">
        Loading...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-slate-800">
        404 Not Found
      </div>
    );
  }

  const {
    title,
    description,
    userId,
    createdAt,
    updatedAt,
    comments,
    book,
    likes,
    dislikes,
  } = data as DiscussionType;

  return (
    <div className="container mx-auto px-4 py-6 bg-slate-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">{title}</h1>
        <div className="flex justify-between mb-4">
          <p className="text-slate-600">{description}</p>
          <Link
            className="text-teal-600 hover:text-teal-800 transition-colors duration-300"
            to={`/discussions/${discussionId}/edit`}
          >
            Edit Discussion
          </Link>
        </div>
        <div className="text-sm text-slate-500 mb-6">
          <p>
            <span className="font-semibold">Created by:</span>{" "}
            {userId ? userId.firstName : "[deleted]"}
          </p>
          <p>
            <span className="font-semibold">Created at:</span>{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Updated at:</span>{" "}
            {new Date(updatedAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">About: </span> {book}
          </p>

          <div className="mt-4 flex space-x-4">
            <LikeButton
              onClick={handleLike}
              disabled={likeMutation.isLoading}
              className={
                "px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              }
            >
              {likes.length}
            </LikeButton>
            <DislikeButton
              onClick={handleDislike}
              disabled={dislikeMutation.isLoading}
              className={
                "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              }
            >
              {dislikes.length}
            </DislikeButton>
          </div>
        </div>
        <div className="flex justify-between mb-6">
          <Link
            className="text-teal-600 hover:text-teal-800 transition-colors duration-300"
            to={`/discussions/${discussionId}/comments`}
          >
            New Comment
          </Link>
          <Link
            className="text-teal-600 hover:text-teal-800 transition-colors duration-300"
            to="/discussions"
          >
            Back
          </Link>
          <DeleteButton id={discussionId!} toBeDeleted="discussions" />
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Comments
          </h2>
          {comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment: CommentType) => (
                <SingleComment
                  key={comment._id}
                  comment={comment}
                  discussionId={discussionId!}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-500">Be the first to comment.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleDiscussion;
