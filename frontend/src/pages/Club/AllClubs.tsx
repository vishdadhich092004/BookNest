import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthContext";

function AllDiscussions() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useAppContext();
  const { isLoading, data, isError } = useQuery(
    "fetchClubs",
    apiClient.fetchClubs,
    {
      onError: () => {
        showToast({ message: "Error fetching Clubs", type: "ERROR" });
      },
    }
  );
  if (isLoading) {
    return <Loader />;
  }
  if (isError || !data) {
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
          to={`${isAuthenticated ? "/clubs/new" : "/sign-in"}`}
          className="px-4 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Create New Club
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((club) => (
          <div
            key={club._id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              {club.title}
            </h2>
            <p className="text-slate-600 mb-4">
              {club.description.slice(0, 100)}
              {club.description.length > 100 ? "..." : ""}
            </p>
            <Link
              to={`/clubs/${club._id}`}
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
