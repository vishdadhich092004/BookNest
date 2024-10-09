import { Link } from "react-router-dom";
import { CommentType } from "../../../../../backend/src/shared/types";
import timeAgo from "../../../utils/timeAgo";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

interface CommentsTypeProps {
  comments: CommentType[];
}

const CommentsTab = ({ comments }: CommentsTypeProps) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
        <p className="text-gray-400">No comments available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {comments.map((comment) => (
        <Link
          to={`/discussions/${comment.discussionId}`}
          key={comment._id}
          className="block group"
        >
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/10 transition-all duration-300 h-full flex flex-col">
            <div className="p-6 flex-grow">
              <div className="flex items-center mb-4">
                <p className="text-xs text-gray-400">
                  {timeAgo(new Date(comment.timestamp))}
                </p>
              </div>
              <p className="text-gray-300 text-sm line-clamp-3">
                {comment.text}
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-700 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-400">
                <AiOutlineArrowUp size={16} className="mx-2" />
                <span>{comment.likes.length}</span>
                <AiOutlineArrowDown size={16} className="mx-2" />
                <span>{comment.likes.length}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CommentsTab;
