import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { Trash2 } from "lucide-react";

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
      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
      disabled={loading}
    >
      {loading ? (
        <>
          <Trash2 className="w-4 h-4 mr-2 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </>
      )}
    </button>
  );
};

export default DeleteButton;
