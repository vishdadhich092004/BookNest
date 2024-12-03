import { useEffect } from "react";
import { XCircle, CheckCircle } from "lucide-react";
import "./Toast.css";

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

  const Icon = type === "SUCCESS" ? CheckCircle : XCircle;
  const baseStyles =
    "fixed top-20 right-4 p-4 rounded-lg shadow-lg max-w-sm w-full flex items-center space-x-3 transition-all duration-300 ease-in-out z-[100]";
  const typeStyles =
    type === "SUCCESS"
      ? "bg-green-900 text-green-100 border-l-4 border-green-500"
      : "bg-red-900 text-red-100 border-l-4 border-red-500";

  return (
    <div className={`toast-slide-in ${baseStyles} ${typeStyles}`}>
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span className="text-sm font-medium flex-grow">{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-200 transition-colors duration-200 focus:outline-none"
        aria-label="Close"
      >
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
