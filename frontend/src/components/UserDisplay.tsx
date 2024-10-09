import React from "react";
import { Crown } from "lucide-react";

const ADMIN_ID = (import.meta.env.VITE_ADMIN_ID as string) || "";

interface UserDisplayProps {
  user:
    | {
        _id: string;
        firstName: string;
        lastName?: string;
        profileAvatar?: string;
      }
    | null
    | undefined;
  onClick?: () => void;
}

const UserDisplay: React.FC<UserDisplayProps> = ({ user, onClick }) => {
  if (!user) {
    return <span className="text-gray-400">User not found</span>;
  }

  const isAdmin = user._id === ADMIN_ID;

  return (
    <div className="flex items-center cursor-pointer" onClick={onClick}>
      <div className="relative">
        {user.profileAvatar ? (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mr-2 shadow-md border-2 border-gray-700"
            dangerouslySetInnerHTML={{ __html: user.profileAvatar }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-2 shadow-md">
            <span className="text-white font-bold text-lg">
              {user.firstName ? user.firstName[0] : "?"}
            </span>
          </div>
        )}
        {isAdmin && (
          <div
            className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1"
            title="Admin"
          >
            <Crown size={12} className="text-gray-900" />
          </div>
        )}
      </div>
      <span className="text-gray-200 font-medium">
        {user.firstName} {user.lastName || ""}
      </span>
    </div>
  );
};

export default UserDisplay;
