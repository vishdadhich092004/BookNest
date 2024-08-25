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
    return (
      <div className="text-center text-red-600 text-2xl font-bold">
        404 Not found
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="text-center text-2xl font-bold text-slate-800">
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
            className="px-4 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Create New Discussion
          </Link>
        </div>
      ) : (
        <div className="mb-6 flex items-center space-x-4">
          <span className="text-slate-800">Create New Discussion</span>
          <Link
            to="/sign-in"
            className="px-4 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Login
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((discussion) => (
          <div
            key={discussion._id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              {discussion.title}
            </h2>
            <p className="text-slate-600 mb-4">
              {discussion.description || "No description available."}
            </p>
            <Link
              to={`/discussions/${discussion._id}`}
              className="text-teal-600 hover:text-teal-800 transition-colors duration-300"
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
