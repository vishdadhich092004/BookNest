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
import { BookAIcon } from "lucide-react";

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
    return <div>Loading...</div>;
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

      {/* Display discussions using BentoGrid */}
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
    </div>
  );
}

const DiscussionHeader = ({ discussion }: { discussion: DiscussionType }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    {/* Customize the header as needed based on discussion content */}
    <div className="text-xl p-4">{discussion.userId.firstName}</div>
  </div>
);

const DiscussionIcon = () => (
  <div className="h-4 w-4 text-neutral-500">
    {/* Customize icon for each discussion */}
    <BookAIcon />
  </div>
);

export default AllDiscussions;
