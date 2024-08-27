import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

type ClubProps = {
  clubId: string;
};

function LeaveClubButton({ clubId }: ClubProps) {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const naviagte = useNavigate();

  const leaveClubMutation = useMutation(() => apiClient.leaveClub(clubId), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["fetchClubById", clubId]);
      showToast({ message: "GoodBye!, hope to see you soon", type: "SUCCESS" });
      naviagte("/clubs");
    },
    onError: () => {
      showToast({
        message: "You can't leave the club, please try again later",
        type: "ERROR",
      });
    },
  });

  const handleLeaveClub = () => {
    leaveClubMutation.mutate();
  };

  return (
    <button
      onClick={handleLeaveClub} // Changed from onSubmit to onClick
      disabled={leaveClubMutation.isLoading}
      className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors duration-300 text-sm uppercase tracking-wide"
    >
      Leave Club
    </button>
  );
}

export default LeaveClubButton;
