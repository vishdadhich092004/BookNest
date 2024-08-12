import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "";

type DeleteButtonProps = {
  id: string;
  toBeDeleted: string;
};

const DeleteButton = ({ id, toBeDeleted }: DeleteButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const response = await fetch(`${BASE_URL}/api/${toBeDeleted}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${toBeDeleted}`);
      }

      showToast({
        message: `${
          toBeDeleted.charAt(0).toUpperCase() + toBeDeleted.slice(1)
        } deleted successfully`,
        type: "SUCCESS",
      });
      navigate(`/${toBeDeleted}`);
    } catch (err) {
      setError(`Failed to delete ${toBeDeleted}`);
      showToast({
        message: `Error deleting ${toBeDeleted}${error}`,
        type: "ERROR",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors duration-300"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteButton;
