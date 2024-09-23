import { ClubType } from "../../../../../backend/src/shared/types";

interface ClubsTabProps {
  clubs: ClubType[];
}
function ClubsTab({ clubs }: ClubsTabProps) {
  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg">
      {clubs.length > 0 ? (
        <ul className="space-y-4">
          {clubs.map((club, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <strong className="text-cyan-400">Title:</strong> {club.title}
              <br />
              <strong className="text-cyan-400">Description:</strong>{" "}
              {club.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No clubs found.</p>
      )}
    </div>
  );
}

export default ClubsTab;
