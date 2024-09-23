import { CommentType } from "../../../../../backend/src/shared/types";

interface CommentsTabProps {
  comments: CommentType[];
}
function CommentsTab({ comments }: CommentsTabProps) {
  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg">
      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <strong className="text-cyan-400">Comment:</strong> {comment.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments found.</p>
      )}
    </div>
  );
}

export default CommentsTab;
