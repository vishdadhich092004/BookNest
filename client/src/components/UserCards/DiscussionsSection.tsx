import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DiscussionType } from "../../../../server/src/shared/types";
import timeAgo from "../../utils/timeAgo";

interface DiscussionsSectionProps {
  discussions: DiscussionType[] | [];
}

const DiscussionsSection = ({ discussions }: DiscussionsSectionProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {discussions?.map((discussion) => (
      <motion.div
        key={discussion._id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg p-4 shadow-lg"
      >
        <Link to={`/discussions/${discussion._id}`} className="block group">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors duration-300">
            {discussion.title}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              {timeAgo(new Date(discussion.createdAt))}
            </p>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </Link>
      </motion.div>
    ))}
  </div>
);

export default DiscussionsSection;
