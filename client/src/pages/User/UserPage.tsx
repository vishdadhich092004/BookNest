import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";
import { MessageCircle, Book, User, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utills";
import {
  BookType,
  CommentType,
  DiscussionType,
} from "../../../../server/src/shared/types";
import DeleteUserButton from "../../components/Buttons/DeleteUserButton";
import BooksSection from "../../components/UserCards/BooksSection";
import CommentsSection from "../../components/UserCards/CommentsSection";
import DiscussionsSection from "../../components/UserCards/DiscussionsSection";
import Loader from "../../components/Loader";

function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    "comments" | "discussions" | "books"
  >("comments");
  const { data: comments, isLoading: loadingComments } = useQuery<
    CommentType[]
  >(
    ["userComments", userId],
    () => apiClient.fetchUserComments(userId as string),
    {
      onError: () => {
        showToast({ message: "Error fetching comments", type: "ERROR" });
      },
    }
  );

  const { data: discussions, isLoading: loadingDiscussions } = useQuery<
    DiscussionType[]
  >(
    ["userDiscussions", userId],
    () => apiClient.fetchUserDiscussions(userId as string),
    {
      onError: () => {
        showToast({ message: "Error fetching discussions", type: "ERROR" });
      },
    }
  );

  const { data: books, isLoading: loadingBooks } = useQuery<BookType[]>(
    ["userBooks", userId],
    () => apiClient.fetchUserBooks(userId as string),
    {
      onError: () => {
        showToast({ message: "Error fetching books", type: "ERROR" });
      },
    }
  );

  if (loadingComments || loadingDiscussions || loadingBooks) {
    return <Loader />;
  }
  const ADMIN_ID = (import.meta.env.VITE_ADMIN_ID as string) || "";
  const isAdmin = userId === ADMIN_ID;
  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
      <div className="max-w-md mx-auto sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mt-8">
        <header className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            {!isAdmin && <DeleteUserButton className="mr-2 sm:mr-3" />}
            {isAdmin && (
              <Link
                to="/books/new"
                className="text-purple-400 hover:text-purple-300 font-semibold transition duration-200"
              >
                Add New Book
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-400">
              User Profile
            </h1>
          </div>
          <div className="flex justify-between sm:justify-start sm:space-x-4">
            <TabButton
              icon={MessageCircle}
              label="Comments"
              isActive={activeTab === "comments"}
              onClick={() => setActiveTab("comments")}
            />
            <TabButton
              icon={User}
              label="Discussions"
              isActive={activeTab === "discussions"}
              onClick={() => setActiveTab("discussions")}
            />
            <TabButton
              icon={Book}
              label="Books"
              isActive={activeTab === "books"}
              onClick={() => setActiveTab("books")}
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "comments" && (
              <CommentsSection comments={comments!} />
            )}
            {activeTab === "discussions" && (
              <DiscussionsSection discussions={discussions!} />
            )}
            {activeTab === "books" && <BooksSection books={books!} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const TabButton: React.FC<{
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base",
      isActive
        ? "bg-purple-600 text-white"
        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
    )}
  >
    <Icon size={18} className="mr-2" />
    {label}
  </button>
);

export default UserPage;
