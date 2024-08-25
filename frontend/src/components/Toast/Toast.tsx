import { useEffect } from "react";
import "./Toast.css"; // Import the CSS file for custom animations

type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles =
    type === "SUCCESS"
      ? "toast-slide-in-success fixed top-4 left-1/2 transform -translate-z-50 p-4 rounded-md bg-green-500 text-white max-w-xs flex items-center space-x-4"
      : "toast-slide-in-error fixed top-4 left-1/2 transform -translate-z-50 p-4 rounded-md bg-red-500 text-white max-w-xs flex items-center space-x-4";

  return (
    <div className={styles}>
      <span className="text-lg font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-white hover:text-gray-300 focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
}
