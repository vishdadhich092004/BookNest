import {
  BookType,
  CommentType,
  DiscussionType,
  ReviewType,
} from "../../../../server/src/shared/types";
import { Tabs } from "../aceternity-ui/tabs";
import BooksTab from "./Tabs/BooksTab";
import CommentsTab from "./Tabs/CommentsTab";
import DiscussionsTab from "./Tabs/DiscussionsTab";
import ReviewsTab from "./Tabs/ReviewsTab";
import { cn } from "../../lib/utills"; // Assuming you have this utility

type SearchResultsProps = {
  results: {
    books: BookType[];
    comments: CommentType[];
    discussions: DiscussionType[];
    reviews: ReviewType[];
  };
};

function ResultTabs({ results }: SearchResultsProps) {
  const tabs = [
    {
      title: "Books",
      value: "books",
      content: <BooksTab books={results.books} />,
    },
    {
      title: "Discussions",
      value: "discussions",
      content: <DiscussionsTab discussions={results.discussions} />,
    },
    {
      title: "Reviews",
      value: "reviews",
      content: <ReviewsTab reviews={results.reviews} />,
    },
    {
      title: "Comments",
      value: "comments",
      content: <CommentsTab comments={results.comments} />,
    },
  ];

  return (
    <div
      className={cn(
        "h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col w-full items-start justify-start my-20",
        "bg-black bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg",
        "border border-indigo-500/20"
      )}
    >
      <Tabs
        tabs={tabs}
        containerClassName="p-4"
        tabClassName={cn(
          "text-white hover:text-indigo-400 transition-colors duration-300",
          "border-b-2 border-transparent hover:border-indigo-500"
        )}
        activeTabClassName={cn(
          "text-indigo-400 border-b-2 border-indigo-500",
          "bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
        )}
        contentClassName="mt-4 text-white"
      />
    </div>
  );
}

export default ResultTabs;
