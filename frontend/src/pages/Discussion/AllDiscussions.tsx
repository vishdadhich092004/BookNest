import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { Skeleton } from "../../components/aceternity-ui/card";
import DiscussionCard from "../../components/Discussions/DiscussionCard";

function AllDiscussions() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useAppContext();
  const {
    isLoading,
    data: discussions,
    isError,
  } = useQuery("allDiscussions", apiClient.allDiscussions, {
    onError: () => {
      showToast({ message: "Error fetching discussions", type: "ERROR" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton />
      </div>
    );
  }

  if (isError || !discussions) {
    return (
      <div className="text-center text-red-600 text-2xl font-bold">
        404 Not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          to={isAuthenticated ? "/discussions/new" : "/sign-in"}
          className="px-4 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Create New Discussion
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discussions.map((discussion) => (
          <motion.div
            key={discussion._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DiscussionCard discussion={discussion} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AllDiscussions;
