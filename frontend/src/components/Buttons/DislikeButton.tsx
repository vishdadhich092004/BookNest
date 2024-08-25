import { ReactNode } from "react";
import { AiTwotoneDislike } from "react-icons/ai";

type Props = {
  onClick: () => void;
  disabled: boolean;
  className: string;
  children: ReactNode;
};

// DislikeButton Component
function DislikeButton({ onClick, disabled, className, children }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} flex items-center space-x-2`}
    >
      <AiTwotoneDislike />
      <span>{children}</span>
    </button>
  );
}
export default DislikeButton;
