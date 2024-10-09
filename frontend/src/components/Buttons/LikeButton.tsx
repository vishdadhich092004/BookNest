import { ReactNode } from "react";

type ButtonProps = {
  onClick: () => void;
  disabled: boolean;
  upvoted: boolean; // Changed prop name to indicate upvoted
  className?: string;
  children?: ReactNode;
};

// UpvoteButton Component
function UpvoteButton({
  onClick,
  disabled,
  upvoted,
  className,
  children,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} flex items-center`}
    >
      <svg
        className={`w-6 h-6 ${upvoted ? "text-orange-500" : "text-gray-400"}`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4 3 15h6v5h6v-5h6z"
          fill={upvoted ? "currentColor" : "none"}
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
export default UpvoteButton;
