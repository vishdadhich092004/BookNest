import React from "react";
import { DiscussionType } from "../../../../../backend/src/shared/types";
import { motion } from "framer-motion";
import { FaComments, FaUser } from "react-icons/fa";

interface DiscussionsTabProps {
  discussions: DiscussionType[];
}

const DiscussionCard: React.FC<{ discussion: DiscussionType }> = ({
  discussion,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700"
  >
    <h3 className="text-2xl font-bold mb-2 text-cyan-400">
      {discussion.title}
    </h3>
    <p className="text-gray-300 mb-4 line-clamp-3">{discussion.description}</p>
    <div className="flex items-center text-sm text-gray-400 mb-2">
      <FaUser className="mr-2" />
      <span>{discussion.userId?.firstName}</span>
    </div>
  </motion.div>
);

function DiscussionsTab({ discussions }: DiscussionsTabProps) {
  return (
    <div className="w-full h-full overflow-y-auto p-6 bg-gray-900">
      {discussions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discussions.map((discussion, index) => (
            <DiscussionCard key={index} discussion={discussion} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full text-center"
        >
          <FaComments className="text-6xl text-gray-600 mb-4" />
          <p className="text-xl text-white">No discussions found.</p>
          <p className="text-gray-400 mt-2">
            Try adjusting your search or filters.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default DiscussionsTab;
