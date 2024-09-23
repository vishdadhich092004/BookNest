import { DiscussionType } from "../../../../../backend/src/shared/types";

interface DiscussionsTabProps {
  discussions: DiscussionType[];
}

function DiscussionsTab({ discussions }: DiscussionsTabProps) {
  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg">
      {discussions.length > 0 ? (
        <ul className="space-y-4">
          {discussions.map((discussion, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <strong className="text-cyan-400">Title:</strong>{" "}
              {discussion.title}
              <br />
              <strong className="text-cyan-400">Description:</strong>{" "}
              {discussion.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No discussions found.</p>
      )}
    </div>
  );
}

export default DiscussionsTab;
