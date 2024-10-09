import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { DiscussionType } from "../../../../backend/src/shared/types";
import { PlusCircle, MessageCircle, ChevronRight } from "lucide-react";
import Pagination from "../../components/Pagination";
import { cn } from "../../lib/utills";
import UserDisplay from "../../components/UserDisplay";
import timeAgo from "../../utils/timeAgo";
import Loader from "../../components/Loader";
import NoResultCard from "../../components/Search/Tabs/NoResultCard";

const AllDiscussions = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useAppContext();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { isLoading, data, isError } = useQuery(
    ["allDiscussions", page],
    () => apiClient.fetchDiscussions(page, limit),
    {
      onError: () => {
        showToast({ message: "Error fetching discussions", type: "ERROR" });
      },
    }
  );

  if (isLoading) {
    return <Loader />;
  }
  if (isError || !data) {
    return (
      <div className="flex justify-center items-center mt-52">
        <NoResultCard />;
      </div>
    );
  }

  const { discussions, currentPage, totalPages } = data;
  return (
    <div className="min-h-screen bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Discussions
          </h1>
          <Link
            to={isAuthenticated ? "/discussions/new" : "/sign-in"}
            className={cn(
              "mt-1 text-white rounded-full",
              "hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center",
              "font-semibold text-sm sm:text-base"
            )}
          >
            <PlusCircle className="mr-2" size={20} />
            New Discussion
          </Link>
        </header>

        {isLoading ? (
          <DiscussionsSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {discussions.map((discussion: DiscussionType) => (
              <DiscussionCard key={discussion._id} discussion={discussion} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

const DiscussionCard = ({ discussion }: { discussion: DiscussionType }) => (
  <Link to={`${discussion._id}`} className="block group">
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/10 transition-all duration-300 h-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4">
          <UserDisplay user={discussion.userId || null} />
          <div className="ml-3">
            {discussion.userId ? (
              <>
                <p className="text-xs text-gray-400 ">
                  {timeAgo(new Date(discussion.createdAt))}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-gray-400">[deleted]</p>
            )}
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors duration-300">
          {discussion.title}
        </h2>
        <p className="text-gray-400 text-sm line-clamp-2">
          {discussion.description}
        </p>
      </div>
      <div className="px-6 py-4 bg-gray-800 flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-400">
          <MessageCircle size={16} className="mr-2" />
          <span>{discussion.comments?.length || 0} comments</span>
        </div>
        <ChevronRight
          size={20}
          className="text-purple-400 group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </div>
  </Link>
);

const DiscussionsSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="bg-gray-900 rounded-lg overflow-hidden shadow-lg h-full animate-pulse"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-800"></div>
            <div className="ml-3">
              <div className="h-4 bg-gray-800 rounded w-24"></div>
              <div className="h-3 bg-gray-800 rounded w-16 mt-2"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-2/3"></div>
        </div>
        <div className="px-6 py-4 bg-gray-800">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

export default AllDiscussions;
