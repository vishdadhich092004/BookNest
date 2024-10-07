interface UserDisplayProps {
  user: {
    _id: string;
    firstName: string;
  };
  onClick: () => void; // Add onClick prop to handle dropdown toggle
}

const UserDisplay = ({ user, onClick }: UserDisplayProps) => {
  return (
    <div className="flex items-center cursor-pointer" onClick={onClick}>
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-4 shadow-md">
        <span className="text-white font-bold text-lg">
          {user.firstName[0]}
        </span>
      </div>
      <span className="text-white text-sm font-medium">{user.firstName}</span>
    </div>
  );
};

export default UserDisplay;
