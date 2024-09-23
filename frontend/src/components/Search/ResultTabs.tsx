import {
  BookType,
  ClubType,
  CommentType,
  DiscussionType,
  ReviewType,
} from "../../../../backend/src/shared/types";
import { Tabs } from "../aceternity-ui/tabs";
import BooksTab from "./Tabs/BooksTab";
import ClubsTab from "./Tabs/ClubsTab";
import CommentsTab from "./Tabs/CommentsTab";
import DiscussionsTab from "./Tabs/DiscussionsTab";
import ReviewsTab from "./Tabs/ReviewsTab";

type SearchResultsProps = {
  results: {
    books: BookType[];
    comments: CommentType[];
    discussions: DiscussionType[];
    reviews: ReviewType[];
    clubs: ClubType[];
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
    {
      title: "Clubs",
      value: "clubs",
      content: <ClubsTab clubs={results.clubs} />,
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col w-full items-start justify-start my-40">
      <Tabs tabs={tabs} />
    </div>
  );
}

export default ResultTabs;
