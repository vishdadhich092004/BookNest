import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import Loader from "../components/Loader";
import BookCard from "../components/UserCards/BooksCard";
import CommentCard from "../components/UserCards/CommentsCard";
import DiscussionCard from "../components/UserCards/DiscussionsCard";
import DeleteUserButton from "../components/Buttons/DeleteUserButton";

function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const { showToast } = useAppContext();

  const { data: comments, isLoading: loadingComments } = useQuery(
    ["userComments", userId],
    () => apiClient.fetchUserComments(userId as string),
    {
      onError: () => {
        showToast({ message: "Error fetching comments", type: "ERROR" });
      },
    }
  );
  const { data: discussions, isLoading: loadingDiscussions } = useQuery(
    ["userDiscussions", userId],
    () => apiClient.fetchUserDiscussions(userId as string),
    {
      onError: () => {
        showToast({ message: "Error fetching discussions", type: "ERROR" });
      },
    }
  );

  const { data: books, isLoading: loadingBooks } = useQuery(
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

  return (
    <div className="container mx-auto px-4 py-6 bg-slate-50">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">User Profile</h2>
      <DeleteUserButton />
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Comments</h3>
        {comments?.map((comment, index) => (
          <CommentCard key={index} text={comment.text} />
        ))}
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          Discussions
        </h3>
        {discussions?.map((discussion, index) => (
          <DiscussionCard
            key={index}
            title={discussion.title}
            description={discussion.description}
            discussionId={discussion._id}
          />
        ))}
      </section>

      <section>
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Books</h3>
        {books?.map((book, index) => (
          <BookCard
            key={index}
            title={book.title}
            author={book.author}
            bookId={book._id}
          />
        ))}
      </section>
    </div>
  );
}

export default UserPage;
