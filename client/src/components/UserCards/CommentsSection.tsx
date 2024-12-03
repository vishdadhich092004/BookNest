import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CommentType } from "../../../../server/src/shared/types";
import timeAgo from "../../utils/timeAgo";

interface CommentsSectionProps {
  comments: CommentType[] | [];
}
const CommentsSection = ({ comments }: CommentsSectionProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {comments?.map((comment) => (
      <motion.div
        key={comment._id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg p-4 shadow-lg"
      >
        <Link
          to={`/discussions/${comment.discussionId}`}
          className="block group"
        >
          <p className="text-gray-300 text-sm sm:text-base mb-2">
            {comment.text}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              {timeAgo(new Date(comment.timestamp))}
            </p>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </Link>
      </motion.div>
    ))}
  </div>
);

export default CommentsSection;
