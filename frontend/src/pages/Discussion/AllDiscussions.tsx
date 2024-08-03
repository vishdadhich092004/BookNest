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
  if (isLoading)
    return (
      <div className="text-2xl font-bold flex justify-center items-center">
        Loading ...
      </div>
    );
  return (
    <div>
      {isLoggedIn ? (
        <Link
          to="/discussions/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-sm hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105"
        >
          Create new Discussion
        </Link>
      ) : (
        <>
          <span>Create new Discussion</span>
          <Link
            to="/sign-in"
            className="px-4 py-2 bg-indigo-600 text-white rounded-sm hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105"
          >
            Login
          </Link>
        </>
      )}

      <div>
        <ul>
          {data.map((data) => (
            <div>
              <Link to={`/discussions/${data._id}`} key={data.title}>
                {data.title}
              </Link>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AllDiscussions;
