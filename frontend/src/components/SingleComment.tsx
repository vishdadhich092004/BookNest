import { CommentType } from "../../../backend/src/shared/types";

type SingleCommentType = {
  comment: CommentType;
};
function SingleComment({ comment }: SingleCommentType) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <p className="text-gray-700">{comment.text}</p>
      <div className="text-sm text-gray-500 mt-2">
        <p>
          <span className="font-semibold">Commented by:</span>{" "}
          {comment.userId.firstName}
        </p>
        <p>
          <span className="font-semibold">On:</span>{" "}
          {new Date(comment.timestamp).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Likes:</span> {comment.likes}
        </p>
      </div>
    </div>
  );
}

export default SingleComment;
