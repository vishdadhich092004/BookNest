import { MessageCircle } from "lucide-react";
import { CommentType } from "../../../../backend/src/shared/types";
import SingleComment from "../SingleComment";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface CommentSectionProps {
  comments: CommentType[];
  discussionId: string;
}

function CommentSection({ comments, discussionId }: CommentSectionProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mt-8">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <MessageCircle className="mr-2" />
            Comments
          </h2>
          {isAuthenticated ? (
            <Link
              to={`/discussions/${discussionId}/comments`}
              className="inline-block bg-purple-600 text-white px-4 py-1 rounded-md hover:bg-purple-700 transition duration-300"
            >
              Add Comment
            </Link>
          ) : (
            <p className="text-gray-400">Login to add a comment</p>
          )}
        </div>
        {comments && comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment: CommentType) => (
              <SingleComment
                key={comment._id}
                comment={comment}
                discussionId={discussionId}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Be the first to comment.</p>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
