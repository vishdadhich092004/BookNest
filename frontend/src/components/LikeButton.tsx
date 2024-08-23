import { ReactNode } from "react";
import { AiTwotoneLike } from "react-icons/ai";

type Props = {
  onClick: () => void;
  disabled: boolean;
  className: string;
  children: ReactNode;
};

function LikeButton({ onClick, disabled, className, children }: Props) {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      <span>
        <AiTwotoneLike />
        {children}
      </span>
    </button>
  );
}

export default LikeButton;
