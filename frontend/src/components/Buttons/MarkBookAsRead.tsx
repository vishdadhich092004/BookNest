import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
type Props = {
  bookId: string;
};

function MarkBookAsRead({ bookId }: Props) {
  const { refetchUser } = useAuth();
  const { showToast } = useAppContext();
  const markReadMutation = useMutation(() => apiClient.markBookAsRead(bookId), {
    onSuccess: () => {
      showToast({ message: "Book Marked as Read", type: "SUCCESS" });
      refetchUser();
    },
    onError: () => {
      showToast({ message: "Error Marking book", type: "ERROR" });
    },
  });
  const handleMarkAsRead = () => {
    markReadMutation.mutate();
  };

  return (
    <div>
      <button
        onClick={handleMarkAsRead}
        className="bg-yellow-500 font-bold text-white py-3 px-2"
      >
        Mark As Read
      </button>
    </div>
  );
}

export default MarkBookAsRead;
