import { Link } from "react-router-dom";

type DiscussionCardProps = {
  title: string;
  description: string;
  discussionId: string;
};

const DiscussionCard = ({
  title,
  description,
  discussionId,
}: DiscussionCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <Link
        to={`/discussions/${discussionId}`}
        className="text-lg font-bold text-teal-600 hover:underline"
      >
        {title}
      </Link>
      <p className="text-slate-600 mt-2 mb-4">{description}</p>
    </div>
  );
};

export default DiscussionCard;
