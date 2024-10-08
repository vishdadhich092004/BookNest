import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import { useAppContext } from "../contexts/AppContext";
import {
  likeComment,
  unlikeComment,
  dislikeComment,
  undislikeComment,
} from "../api-client";
import { CommentType } from "../../../backend/src/shared/types";
import UpvoteButton from "./Buttons/LikeButton";
import DownvoteButton from "./Buttons/DislikeButton";
import UserDisplay from "./UserDisplay";
import timeAgo from "../utils/timeAgo";
import EllipsisMenu from "./EllipsisMenu"; // Import the EllipsisMenu component
import { useNavigate } from "react-router-dom";

interface SingleCommentProps {
  comment: CommentType;
  discussionId: string;
}

const SingleComment: React.FC<SingleCommentProps> = ({
  comment,
  discussionId,
}) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const likeMutation = useMutation(
    () => likeComment(discussionId, comment._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchDiscussionById", discussionId]);
      },
      onError: () => {
        showToast({ message: "Error liking comment", type: "ERROR" });
      },
    }
  );

  const unlikeMutation = useMutation(
    () => unlikeComment(discussionId, comment._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchDiscussionById", discussionId]);
      },
      onError: () => {
        showToast({ message: "Error unliking comment", type: "ERROR" });
      },
    }
  );

  const dislikeMutation = useMutation(
    () => dislikeComment(discussionId, comment._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchDiscussionById", discussionId]);
      },
      onError: () => {
        showToast({ message: "Error disliking comment", type: "ERROR" });
      },
    }
  );

  const undislikeMutation = useMutation(
    () => undislikeComment(discussionId, comment._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchDiscussionById", discussionId]);
      },
      onError: () => {
        showToast({ message: "Error undisliking comment", type: "ERROR" });
      },
    }
  );

  // Determine if the user has liked or disliked the comment
  const userHasLiked = user && comment.likes.includes(user._id);
  const userHasDisliked = user && comment.dislikes.includes(user._id);

  const isOwner = isAuthenticated && comment.userId._id === user?._id;
  console.log(isOwner);

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

  // const handleEdit = () => {
  //   // Handle the edit functionality here
  //   console.log("Edit comment:", comment._id);
  // };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-2">
        {comment.userId ? (
          <div className="flex flex-col">
            <UserDisplay user={comment.userId} />
            <p className="text-sm text-gray-400 ml-14 -mt-3">
              {timeAgo(new Date(comment.timestamp))}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-sm text-gray-400">[deleted]</p>
            <p className="text-sm text-gray-400">
              {timeAgo(new Date(comment.timestamp))}
            </p>
          </div>
        )}

        {isAuthenticated && comment.userId._id === user?._id && (
          <EllipsisMenu
            onEdit={() => navigate(``)}
            id={comment._id!}
            toBeDeleted="comments"
          />
        )}
      </div>
      <p className="text-gray-300">{comment.text}</p>
      <div className="flex justify-between items-center mt-2">
        <div className="flex space-x-4">
          <UpvoteButton
            onClick={handleLike}
            disabled={likeMutation.isLoading}
            upvoted={userHasLiked!} // Pass upvoted state
            className="flex items-center text-lg"
          >
            <span>{comment.likes.length}</span>
          </UpvoteButton>
          <DownvoteButton
            onClick={handleDislike}
            disabled={dislikeMutation.isLoading}
            downvoted={userHasDisliked!} // Pass downvoted state
            className="flex items-center text-lg"
          >
            <span>{comment.dislikes.length}</span>
          </DownvoteButton>
        </div>
      </div>
    </div>
  );
};

export default SingleComment;
