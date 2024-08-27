import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

type ClubProps = {
  clubId: string;
};

function JoinClubButton({ clubId }: ClubProps) {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const joinClubMutation = useMutation(() => apiClient.joinClub(clubId), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["fetchClubById", clubId]);
      showToast({ message: "Welcome to the Club", type: "SUCCESS" });
      navigate(`/clubs/${clubId}`);
    },
    onError: () => {
      showToast({
        message: "You can't join the club, please try again later",
        type: "ERROR",
      });
    },
  });

  const handleJoinClub = () => {
    joinClubMutation.mutate();
  };

  return (
    <button
      onClick={handleJoinClub} // Changed from onSubmit to onClick
      disabled={joinClubMutation.isLoading}
      className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors duration-300 text-sm uppercase tracking-wide"
    >
      Join Club
    </button>
  );
}

export default JoinClubButton;
