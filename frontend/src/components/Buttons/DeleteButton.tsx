import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { Trash2Icon } from "lucide-react";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "";

type DeleteButtonProps = {
  id: string;
  toBeDeleted: string;
};

const DeleteButton = ({ id, toBeDeleted }: DeleteButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/${toBeDeleted}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${toBeDeleted}`);
      }

      showToast({
        message: `${capitalize(toBeDeleted).slice(
          0,
          toBeDeleted.length - 1
        )} deleted successfully`,
        type: "SUCCESS",
      });
      navigate(`/${toBeDeleted}`);
    } catch (error) {
      showToast({
        message: `Error deleting ${toBeDeleted}. Please try again.`,
        type: "ERROR",
      });
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`flex items-center px-4 py-2 bg-red-600 text-white rounded-md shadow-md transition duration-300 ${
        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
      }`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Deleting...
        </>
      ) : (
        <Trash2Icon></Trash2Icon>
      )}
    </button>
  );
};

export default DeleteButton;
