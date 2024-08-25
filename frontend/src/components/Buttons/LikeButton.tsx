import { ReactNode } from "react";
import { AiTwotoneLike } from "react-icons/ai";

type ButtonProps = {
  onClick: () => void;
  disabled: boolean;
  className: string;
  children: ReactNode;
};

// LikeButton Component
function LikeButton({ onClick, disabled, className, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} flex items-center space-x-2`}
    >
      <AiTwotoneLike />
      <span>{children}</span>
    </button>
  );
}
export default LikeButton;
