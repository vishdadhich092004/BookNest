import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utills"; // Assuming you're using this for classnames
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  onClick?: () => void; // Optional prop to close dropdown
  className?: string;
  children?: React.ReactNode;
}

const SignOutButton = ({
  onClick,
  className,
  children,
}: SignOutButtonProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validate-token");
      queryClient.setQueryData("validate-token", null);
      showToast({ message: "Signed Out!", type: "SUCCESS" });
      navigate("/");
      if (onClick) onClick(); // Call onClick prop to close dropdown
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full",
        "hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center",
        "font-semibold text-sm sm:text-base",
        `${className}`
      )}
    >
      {children || <LogOut className="w-4 h-4 mr-3 text-white" />}
    </button>
  );
};

export default SignOutButton;
