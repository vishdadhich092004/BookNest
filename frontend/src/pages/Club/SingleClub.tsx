import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";
import Loader from "../../components/Loader";
import { ClubType } from "../../../../backend/src/shared/types";
import { useQuery } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import JoinClubButton from "../../components/Buttons/JoinClubButton";
import LeaveClubButton from "../../components/Buttons/LeaveClubButton";
import ManageClubButton from "../../components/Buttons/ManageClubButton";
import DeleteButton from "../../components/Buttons/DeleteButton";

function SingleClub() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { clubId } = useParams<{ clubId: string }>();

  const { data, isLoading, isError } = useQuery(
    ["fetchClubById", clubId],
    () => apiClient.fetchClubById(clubId as string),
    {
      onError: () => {
        showToast({ message: "Error fetching club", type: "ERROR" });
      },
    }
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    navigate("/");
    return (
      <div className="flex justify-center items-center h-screen text-xl text-slate-800">
        404 Not Found
      </div>
    );
  }

  const { title, description, admin, members, bannerImgUrl, profileImgUrl } =
    data as ClubType;

  let isMember = false;
  if (isAuthenticated && user && user._id) {
    for (let i = 0; i < members.length; i++) {
      if (members[i]._id === user._id) {
        isMember = true;
        break;
      }
    }
  }

  const isAdmin = user?._id.toString() === admin._id.toString();

  return (
    <div className="container mx-auto px-4 py-6 bg-slate-50">
      <div className="relative">
        {/* Banner Image */}
        <img
          src={bannerImgUrl}
          alt={title}
          className="w-full h-60 object-cover rounded-t-lg"
        />

        {/* Profile Picture */}
        <img
          src={profileImgUrl}
          alt={title}
          className="absolute top-10 left-4 w-24 h-24 rounded-full border-4 border-white object-cover mt-20"
        />

        {/* Action Buttons on Top Right */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {isAuthenticated &&
            !isAdmin &&
            (isMember ? (
              <LeaveClubButton clubId={clubId!} />
            ) : (
              <JoinClubButton clubId={clubId!} />
            ))}
          {isAdmin && (
            <>
              <ManageClubButton />
              <DeleteButton id={clubId!} toBeDeleted="clubs" />
            </>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-b-lg p-6 mt-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">{title}</h1>
        <div className="flex justify-between mb-4">
          <p className="text-slate-600">{description}</p>
        </div>
        <div className="text-sm text-slate-500 mb-6">
          <p>
            <span className="font-semibold">Created By:</span> {admin.firstName}
          </p>
        </div>
        <div className="text-sm text-slate-500">
          <p>
            <span className="font-semibold">Members:</span> {members.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SingleClub;
