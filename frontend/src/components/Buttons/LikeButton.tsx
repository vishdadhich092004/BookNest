import { ReactNode } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";

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
      className={`${className} flex items-center space-x-2`}
    >
      <AiOutlineArrowUp
        className={upvoted ? "text-blue-500" : "text-gray-400"} // Change color if upvoted
      />
      <span>{children}</span>
    </button>
  );
}

export default UpvoteButton;
