import {
  Card,
  CardTitle,
  CardDescription,
  CardSkeletonContainer,
  Skeleton,
} from "../../components/aceternity-ui/card";
import { DiscussionType } from "../../../../backend/src/shared/types";
import { Link } from "react-router-dom";

interface DiscussionCardProps {
  discussion: DiscussionType;
}

const DiscussionCard = ({ discussion }: DiscussionCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardSkeletonContainer className="flex-grow">
        <Skeleton key={discussion._id} />
      </CardSkeletonContainer>
      <CardTitle>{discussion.title}</CardTitle>
      <CardDescription>
        {discussion.description || "No description available."}
      </CardDescription>
      <Link
        to={`/discussions/${discussion._id}`}
        className="mt-4 text-teal-600 hover:text-teal-800 transition-colors duration-300"
      >
        View More
      </Link>
    </Card>
  );
};
export default DiscussionCard;
