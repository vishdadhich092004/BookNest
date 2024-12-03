import { ReactNode } from "react";

type Props = {
  onClick: () => void;
  disabled: boolean;
  downvoted: boolean; // Changed prop name to indicate downvoted
  className?: string;
  children?: ReactNode;
};

// DownvoteButton Component
function DownvoteButton({
  onClick,
  disabled,
  downvoted,
  className,
  children,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} flex items-center`}
    >
      <svg
        className={`w-6 h-6 ${downvoted ? "text-blue-500" : "text-gray-400"}`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 20 3 9h6V4h6v5h6z"
          fill={downvoted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </button>
  );
}

export default DownvoteButton;
