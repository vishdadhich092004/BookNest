import { CommentType } from "../../../backend/src/shared/types";
import * as apiClient from "../api-client";
import { useMutation, useQueryClient } from "react-query";
import LikeButton from "./Buttons/LikeButton";
import DislikeButton from "./Buttons/DislikeButton";
import { useAppContext } from "../contexts/AppContext";

type SingleCommentType = {
  comment: CommentType;
  discussionId: string;
};

function SingleComment({ comment, discussionId }: SingleCommentType) {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const likeMutation = useMutation(
    () => apiClient.likeComment(discussionId, comment._id),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "fetchDiscussionById",
          discussionId,
        ]);
      },
      onError: () => {
        showToast({ message: "Already Liked", type: "ERROR" });
      },
    }
  );
  const dislikeMutation = useMutation(
    () => apiClient.dislikeComment(discussionId, comment._id),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "fetchDiscussionById",
          discussionId,
        ]);
      },
      onError: () => {
        showToast({ message: "Already Disliked", type: "ERROR" });
      },
    }
  );

  const handleLike = () => {
    likeMutation.mutate();
  };
  const handleDislike = () => {
    dislikeMutation.mutate();
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-4">
      <p className="text-slate-800">{comment.text}</p>
      <div className="text-sm text-slate-600 mt-2">
        <p>
          <span className="font-semibold">Commented by:</span>{" "}
          {comment.userId ? comment.userId.firstName : "[deleted]"}
        </p>
        <p>
          <span className="font-semibold">On:</span>{" "}
          {new Date(comment.timestamp).toLocaleDateString()}
        </p>

        <div className="mt-4 flex space-x-4">
          <LikeButton
            onClick={handleLike}
            disabled={likeMutation.isLoading}
            className={
              "px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors duration-300"
            }
          >
            {comment.likes.length}
          </LikeButton>
          <DislikeButton
            onClick={handleDislike}
            disabled={dislikeMutation.isLoading}
            className={
              "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
            }
          >
            {comment.dislikes.length}
          </DislikeButton>
        </div>
      </div>
    </div>
  );
}

export default SingleComment;
