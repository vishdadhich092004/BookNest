import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";

function SingleDiscussion() {
  console.log("iwrhownvlvds");
  const { showToast } = useAppContext();
  const { id } = useParams<{ id: string }>(); // Get the ID from the route params

  const { isLoading, data, isError } = useQuery(
    ["singleDiscussion", id],
    () => apiClient.singleDiscussion(id as string), // Ensure the ID is passed as a string
    {
      onError: () => {
        showToast({ message: "Error fetching discussion", type: "ERROR" });
      },
    }
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>404 not found</div>;
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}

export default SingleDiscussion;
