import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";
import { DiscussionType } from "../../../../backend/src/shared/types";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthContext";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CircleOff,
} from "lucide-react";
import UserDisplay from "../../components/UserDisplay";
import timeAgo from "../../utils/timeAgo";
import EllipsisMenu from "../../components/EllipsisMenu"; // Import the EllipsisMenu component
import CommentSection from "../../components/Comments/CommentSection";
import DownvoteButton from "../../components/Buttons/DislikeButton";
import UpvoteButton from "../../components/Buttons/LikeButton";

const SingleDiscussion = () => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const { discussionId } = useParams();

  const { data, isLoading, isError } = useQuery(
    ["fetchDiscussionById", discussionId],
    () => apiClient.fetchDiscussionById(discussionId!),
    {
      onError: () => {
        showToast({ message: "Error fetching discussion", type: "ERROR" });
      },
    }
  );

  const likeMutation = useMutation(
    () => apiClient.likeDiscussion(discussionId!),
    {
      onSuccess: async () => {
        showToast({ message: "Discussion Upvoted", type: "SUCCESS" });
        await queryClient.invalidateQueries([
          "fetchDiscussionById",
          discussionId,
        ]);
      },
      onError: () => {
        showToast({
          message: `${isAuthenticated ? "Already Upvoted" : "Please Sign In"}`,
          type: "ERROR",
        });
      },
    }
  );

  const unlikeMutation = useMutation(
    () => apiClient.unlikeDiscussion(discussionId!),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "fetchDiscussionById",
          discussionId,
        ]);
      },
      onError: () => {
        showToast({
          message: `${isAuthenticated ? "Already Upvoted" : "Please Sign In"}`,
          type: "ERROR",
        });
      },
    }
  );

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
        showToast({
          message: `${
            isAuthenticated ? "Already Downvoted" : "Please Sign In"
          }`,
          type: "ERROR",
        });
      },
    }
  );

  const undislikeMutation = useMutation(
    () => apiClient.undislikeDiscussion(discussionId!),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "fetchDiscussionById",
          discussionId,
        ]);
      },
      onError: () => {
        showToast({
          message: `${
            isAuthenticated ? "Already Downvoted" : "Please Sign In"
          }`,
          type: "ERROR",
        });
      },
    }
  );

  if (isLoading) return <Loader />;
  if (isError || !data) {
    navigate("/");
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        404 Not Found
      </div>
    );
  }

  const {
    title,
    description,
    userId,
    comments,
    likes,
    dislikes,
    createdAt,
    bookId,
  } = data as DiscussionType;
  // Determine if the user has liked or disliked the discussion
  const userHasDisliked = user && dislikes.includes(user?._id);
  const userHasLiked = user && likes.includes(user?._id);

  const handleLike = () => {
    if (userHasLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleDislike = () => {
    if (userHasDisliked) {
      undislikeMutation.mutate();
    } else {
      dislikeMutation.mutate();
    }
  };
  return (
    <div className="min-h-screen bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/discussions"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8"
        >
          <ChevronLeft size={20} />
          <span className="ml-2">Back to Discussions</span>
        </Link>

        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col">
                <UserDisplay user={userId} />
                <p className="text-sm text-gray-400 ml-14 lg:-mt-3">
                  {timeAgo(new Date(createdAt))}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {bookId ? (
                  <Link
                    to={`/books/${bookId._id}`}
                    className="bg-purple-600 text-white text-xs px-2 py-2 rounded-full flex items-center hover:bg-purple-700 transition-colors duration-300"
                  >
                    <BookOpen size={12} className="mr-1" />
                    {bookId.title}
                  </Link>
                ) : (
                  <div className="bg-blue-600 text-white text-xs px-2 py-2 rounded-full flex items-center ">
                    <CircleOff size={12} className="mr-1" />
                    Non-Book
                  </div>
                )}
                {isAuthenticated && userId._id === user?._id && (
                  <EllipsisMenu
                    onEdit={() => navigate(`/discussions/${discussionId}/edit`)}
                    id={discussionId!}
                    toBeDeleted="discussions"
                  />
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p
              className={`text-gray-300 ${
                isDescriptionExpanded ? "" : "line-clamp-3"
              }`}
            >
              {description}
            </p>
            {description.length > 150 && (
              <button
                className="text-purple-400 hover:text-purple-300 mt-2 focus:outline-none"
                onClick={() => setDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? (
                  <span className="flex items-center">
                    <ChevronUp size={20} />
                    <span className="ml-1">Show less</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ChevronDown size={20} />
                    <span className="ml-1">Read more</span>
                  </span>
                )}
              </button>
            )}
          </div>
          <div className="p-4 bg-gray-800 flex justify-between items-center">
            <div className="flex space-x-6">
              <UpvoteButton
                onClick={handleLike}
                disabled={likeMutation.isLoading}
                upvoted={userHasLiked!}
                className="flex items-center text-lg"
              >
                <span className="ml-2">{likes.length}</span>
              </UpvoteButton>
              <DownvoteButton
                onClick={handleDislike}
                disabled={dislikeMutation.isLoading}
                downvoted={userHasDisliked!}
                className="flex items-center text-lg"
              >
                <span className="ml-2">{dislikes.length}</span>
              </DownvoteButton>
            </div>
          </div>
        </div>

        <CommentSection comments={comments} discussionId={discussionId!} />
      </div>
    </div>
  );
};

export default SingleDiscussion;
