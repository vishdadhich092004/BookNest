interface UserDisplayProps {
  user: {
    _id: string;
    firstName: string;
    lastName?: string; // Optional lastName field
    profileAvatar?: string; // Optional profileAvatar field
  };
  onClick?: () => void; // Add onClick prop to handle dropdown toggle
}

const UserDisplay = ({ user, onClick }: UserDisplayProps) => {
  if (!user) {
    return <span className="text-gray-400">User not found</span>; // Handle null user case
  }

  return (
    <div className="flex items-center cursor-pointer" onClick={onClick}>
      {user.profileAvatar ? (
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mr-2 shadow-md border-2"
          dangerouslySetInnerHTML={{ __html: user.profileAvatar }}
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-2 shadow-md">
          <span className="text-white font-bold text-lg">
            {user.firstName ? user.firstName[0] : "?"}
          </span>
        </div>
      )}
      <span className="text-gray-200 font-medium">
        {user.firstName} {user.lastName || ""}
      </span>
    </div>
  );
};

export default UserDisplay;
