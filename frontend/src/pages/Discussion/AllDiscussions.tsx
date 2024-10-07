import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  BentoGrid,
  BentoGridItem,
} from "../../components/aceternity-ui/bento-grid";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { DiscussionType } from "../../../../backend/src/shared/types";
import { BookAIcon, PlusCircle } from "lucide-react";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import { cn } from "../../lib/utills";
import NotFound from "../NotFound";

function AllDiscussions() {
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
    return <NotFound />;
  }

  const { discussions, currentPage, totalPages } = data;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Discussions</h1>
        <Link
          to={isAuthenticated ? "/discussions/new" : "/sign-in"}
          className={cn(
            "bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-full shadow-lg",
            "hover:from-purple-500 hover:to-indigo-500 transition-transform duration-300 transform hover:scale-105 flex items-center",
            "ml-0 sm:ml-4 lg:mt-4" // Adjust margin-left for small screens
          )}
        >
          <PlusCircle className="mr-2" />
          Create Your Discussion
        </Link>
      </div>

      <BentoGrid className="max-w-7xl mx-auto">
        {discussions.map((discussion: DiscussionType, i: number) => (
          <BentoGridItem
            key={i}
            link={`${discussion._id}`}
            title={discussion.title}
            description={discussion.description}
            header={<DiscussionHeader discussion={discussion} />}
            icon={<DiscussionIcon />}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

const DiscussionHeader = ({ discussion }: { discussion: DiscussionType }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    <div className="text-xl p-4">{discussion.userId.firstName}</div>
  </div>
);

const DiscussionIcon = () => (
  <div className="h-4 w-4 text-neutral-500">
    <BookAIcon />
  </div>
);

export default AllDiscussions;
