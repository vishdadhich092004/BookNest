import { Link } from "react-router-dom";

type ClubCardProps = {
  name: string;
  description: string;
  clubId: string;
};

const ClubCard = ({ name, description, clubId }: ClubCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <Link
        to={`/clubs/${clubId}`}
        className="text-lg font-bold text-teal-600 hover:underline"
      >
        {name}
      </Link>
      <p className="text-slate-600 mt-2">{description}</p>
    </div>
  );
};

export default ClubCard;
