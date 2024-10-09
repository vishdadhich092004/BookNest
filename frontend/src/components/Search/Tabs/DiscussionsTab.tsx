import React from "react";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { DiscussionType } from "../../../../../backend/src/shared/types";
import timeAgo from "../../../utils/timeAgo";
import NoResultCard from "./NoResultCard";

const DiscussionTab: React.FC<{ discussion: DiscussionType }> = ({
  discussion,
}) => {
  if (!discussion) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
        <NoResultCard />
      </div>
    );
  }
  return (
    <Link to={`/discussions/${discussion._id}`} className="block group">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/10 transition-all duration-300 h-full flex flex-col">
        <div className="p-6 flex-grow">
          <div className="flex items-center mb-4">
            <p className="text-xs text-gray-400">
              {timeAgo(new Date(discussion.createdAt))}
            </p>
          </div>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors duration-300">
            {discussion.title}
          </h2>
          <p className="text-gray-400 text-sm line-clamp-2">
            {discussion.description}
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-700 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-400">
            <MessageCircle size={16} className="mr-2" />
            <span>{discussion.comments?.length || 0} comments</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DiscussionTab;
