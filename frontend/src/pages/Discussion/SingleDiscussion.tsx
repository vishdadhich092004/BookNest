import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthContext";
import { EditIcon, EggFried, Projector } from "lucide-react";
import { useState } from "react";

function SingleDiscussion() {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false); // Add state for controlling description dropdown

  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
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
        await queryClient.invalidateQueries([
          "fetchDiscussionById",
          discussionId,
        ]);
      },
      onError: () => {
        showToast({ message: "Already disliked", type: "ERROR" });
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
    return <Loader />;
  }

  if (isError || !data) {
    navigate("/");
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        404 Not Found
      </div>
    );
  }

  const { title, description, userId, comments, likes, dislikes } =
    data as DiscussionType;
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button at the Top */}
      <div className="mb-6">
        <Link
          className="text-red-400 hover:text-red-600 transition-colors duration-300"
          to="/discussions"
        >
          ← Back
        </Link>
      </div>

      <div className="bg-gray-900 shadow-lg rounded-lg p-6 relative">
        {/* Title and Edit/Delete Buttons */}
        <div className="flex items-center mb-6">
          <EggFried size={40} className="text-yellow-400 mr-4" />
          <h1 className="text-4xl font-bold text-white">{title}</h1>

          {/* Edit and Delete buttons positioned at the top-right */}
          {isAuthenticated &&
            userId._id.toString() === user?._id.toString() && (
              <div className="absolute top-0 right-0 flex space-x-2 p-4">
                <Link
                  className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md transition duration-300 font-bold"
                  to={`/discussions/${discussionId}/edit`}
                >
                  <EditIcon></EditIcon>
                </Link>
                <DeleteButton id={discussionId!} toBeDeleted="discussions" />
              </div>
            )}
        </div>

        {/* Description with 'Read More' functionality */}
        <div className="mb-4">
          <p className="text-gray-300">
            {isDescriptionExpanded
              ? description // Show full description when expanded
              : `${description.slice(0, 10)}...`}{" "}
          </p>
          <button
            className="text-red-600 hover:underline mt-2 focus:outline-none"
            onClick={toggleDescription}
          >
            {isDescriptionExpanded ? "Read Less" : "Read More"}
          </button>
        </div>

        {/* Like and Dislike Buttons */}
        <div className="flex space-x-4 items-center">
          <LikeButton
            onClick={handleLike}
            disabled={likeMutation.isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
          >
            {likes.length}
          </LikeButton>

          <DislikeButton
            onClick={handleDislike}
            disabled={dislikeMutation.isLoading}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors duration-300"
          >
            {dislikes.length}
          </DislikeButton>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <div className="flex mb-3 justify-">
          <Projector size={40} className="text-yellow-400 mr-4" />
          <p className="text-3xl font-semibold text-white mb-4">
            What others say
          </p>
          <Link
            className="text-red-400 hover:text-red-600 transition-colors duration-300"
            to={
              isAuthenticated
                ? `/discussions/${discussionId}/comments`
                : "/sign-in"
            }
          >
            New Comment
          </Link>
        </div>
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
          <p className="text-gray-500">Be the first to comment.</p>
        )}
      </div>
    </div>
  );
}

export default SingleDiscussion;
