import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utills";
import { Trash2 } from "lucide-react";

interface DeleteUserButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const DeleteUserButton = ({
  onClick,
  className,
  children,
}: DeleteUserButtonProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const [isConfirming, setIsConfirming] = useState(false);

  const mutation = useMutation(apiClient.deleteUserAccount, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validate-token");
      queryClient.setQueryData("validate-token", null);
      showToast({ message: "Adios Amigos", type: "SUCCESS" });
      navigate("/");
      if (onClick) onClick();
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      showToast({ message: errorMessage, type: "ERROR" });
      console.error("Delete account error:", error);
    },
  });

  const handleClick = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    mutation.mutate();
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={cn(
          "bg-red-600 text-white px-4 py-2 rounded-full",
          "hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center",
          "font-semibold text-sm sm:text-base",
          `${className}`
        )}
        disabled={mutation.isLoading}
      >
        {children || (
          <>
            <Trash2 className="w-4 h-4 mr-2 text-white" />
            {mutation.isLoading
              ? "Deleting..."
              : isConfirming
              ? "Confirm"
              : "Delete Account"}
          </>
        )}
      </button>
      {isConfirming && (
        <div className="absolute top-full right-0 mt-2  text-white p-5 rounded-md shadow-lg border bg-gray-900">
          <p className="mb-2 text-lg">
            Are you sure you want to delete your account?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-lg bg-gray-900 rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleClick}
              className="px-3 py-1 text-lg bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteUserButton;
