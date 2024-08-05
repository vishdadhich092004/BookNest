import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { Link } from "react-router-dom";

function AllDiscussions() {
  const { showToast, isLoggedIn } = useAppContext();
  const { isLoading, data, isError } = useQuery(
    "allDiscussions",
    apiClient.allDiscussions,
    {
      onError: () => {
        showToast({ message: "Error fetching discussions", type: "ERROR" });
      },
    }
  );

  if (isError || !data) {
    return <div>404 Not found</div>;
  }
  if (isLoading) {
    return (
      <div className="text-2xl font-bold flex justify-center items-center">
        Loading ...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {isLoggedIn ? (
        <div className="mb-6">
          <Link
            to="/discussions/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-sm hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105"
          >
            Create new Discussion
          </Link>
        </div>
      ) : (
        <div className="mb-6 flex items-center space-x-4">
          <span className="text-gray-800">Create new Discussion</span>
          <Link
            to="/sign-in"
            className="px-4 py-2 bg-indigo-600 text-white rounded-sm hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105"
          >
            Login
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((discussion) => (
          <div
            key={discussion._id}
            className="bg-white shadow-md rounded-lg p-6 transform hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {discussion.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {discussion.description || "No description available."}
            </p>
            <Link
              to={`/discussions/${discussion._id}`}
              className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
            >
              View More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllDiscussions;
