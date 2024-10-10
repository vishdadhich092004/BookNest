import { GenreType } from "../../../../backend/src/shared/types";

type GenreFilterProps = {
  genres: GenreType[];
  selectedGenre: string;
  onGenreChange: (genreId: string) => void;
};

function GenreFilter({
  genres,
  selectedGenre,
  onGenreChange,
}: GenreFilterProps) {
  return (
    <div className="w-full sm:w-auto">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Genre
      </label>
      <select
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        className="block w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-200"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre._id} value={genre._id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GenreFilter;
