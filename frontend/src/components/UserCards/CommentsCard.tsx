type CommentCardProps = {
  text: string;
};

const CommentCard = ({ text }: CommentCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <p className="text-slate-800 mb-2">{text}</p>
    </div>
  );
};

export default CommentCard;
