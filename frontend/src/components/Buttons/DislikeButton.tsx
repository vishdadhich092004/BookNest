import { ReactNode } from "react";
import { AiOutlineArrowDown } from "react-icons/ai";

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
      className={`${className} flex items-center space-x-2`}
    >
      <AiOutlineArrowDown
        className={downvoted ? "text-red-500" : "text-gray-400"} // Change color if downvoted
      />
      <span>{children}</span>
    </button>
  );
}

export default DownvoteButton;
