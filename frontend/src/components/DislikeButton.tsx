import { ReactNode } from "react";
import { AiTwotoneDislike } from "react-icons/ai";

type Props = {
  onClick: () => void;
  disabled: boolean;
  className: string;
  children: ReactNode;
};

function DislikeButton({ onClick, disabled, className, children }: Props) {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      <span>
        <AiTwotoneDislike />
        {children}
      </span>
    </button>
  );
}

export default DislikeButton;
