import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import {
  BookType,
  CommentType,
  DiscussionType,
  ReviewType,
} from "../../../../backend/src/shared/types";
import { cn } from "../../lib/utills";
import Loader from "../../components/Loader";
import { Book, MessageCircle, Star, PenTool } from "lucide-react";
import NoResultCard from "./Tabs/NoResultCard";
import UniversalSearchBar from "./UniversalSeachBar";
import BooksTab from "./Tabs/BooksTab";
import DiscussionsTab from "./Tabs/DiscussionsTab";
import CommentsTab from "./Tabs/CommentsTab";
import ReviewsTab from "./Tabs/ReviewsTab";

type SearchResults = {
  books: BookType[];
  comments: CommentType[];
  discussions: DiscussionType[];
  reviews: ReviewType[];
};

type ResultType = "books" | "discussions" | "comments" | "reviews";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<ResultType>("books");

  const {
    isLoading,
    data: results,
    isError,
  } = useQuery<SearchResults, Error>(
    ["searchResults", query],
    () => apiClient.universalSearch(query || ""),
    {
      enabled: !!query,
      onError: () => {
        showToast({ message: "Error fetching search results", type: "ERROR" });
      },
    }
  );

  const tabIcons = {
    books: <Book size={20} />,
    discussions: <MessageCircle size={20} />,
    comments: <PenTool size={20} />,
    reviews: <Star size={20} />,
  };

  const renderTabContent = () => {
    if (!results) return null;

    const noDataMessage = () => (
      <div className="text-center text-gray-400 p-4 bg-gray-800 rounded-lg">
        <NoResultCard />
      </div>
    );

    switch (activeTab) {
      case "books":
        return results.books.length > 0 ? (
          <BooksTab books={results.books} />
        ) : (
          noDataMessage()
        );
      case "discussions":
        return results.discussions.length > 0 ? (
          <DiscussionsTab discussions={results.discussions} />
        ) : (
          noDataMessage()
        );
      case "comments":
        return results.comments.length > 0 ? (
          <CommentsTab comments={results.comments} />
        ) : (
          noDataMessage()
        );
      case "reviews":
        return results.reviews.length > 0 ? (
          <ReviewsTab reviews={results.reviews} />
        ) : (
          noDataMessage()
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <UniversalSearchBar className="mb-5" />
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Search Results for "{query}"
        </h1>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <p className="text-center text-red-500 bg-red-900 bg-opacity-20 p-4 rounded-lg mb-6">
            <NoResultCard />
          </p>
        ) : results ? (
          <>
            <div className="flex justify-start mb-8 overflow-x-auto pb-2">
              {(
                ["books", "discussions", "comments", "reviews"] as ResultType[]
              ).map((tab) => (
                <button
                  key={tab}
                  className={cn(
                    "px-4 py-2 mr-2 rounded-full flex items-center whitespace-nowrap",
                    activeTab === tab
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  )}
                  onClick={() => setActiveTab(tab)}
                >
                  {tabIcons[tab]}
                  <span className="ml-2 capitalize">{tab}</span>
                </button>
              ))}
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              {renderTabContent()}
            </div>
          </>
        ) : (
          <p className="text-center text-xl p-4 bg-yellow-900 bg-opacity-20 rounded-lg mb-6">
            No results found for "{query}"
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
