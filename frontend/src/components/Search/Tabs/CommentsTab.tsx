import { CommentType } from "../../../../../backend/src/shared/types";
import timeAgo from "../../../utils/timeAgo";

interface CommentTypeProps {
  comment: CommentType;
}
const CommentTab = ({ comment }: CommentTypeProps) => {
  if (!comment) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg text-center">
        <p className="text-gray-400">No comment available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <p className="text-gray-300">{comment.text}</p>
      <div className="mt-2 text-xs text-gray-500">
        {timeAgo(new Date(comment.timestamp))}
      </div>
    </div>
  );
};

export default CommentTab;
