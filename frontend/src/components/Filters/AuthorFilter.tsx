import { AuthorType } from "../../../../backend/src/shared/types";

type AuthorFilterProps = {
  authors: AuthorType[];
  selectedAuthor: string;
  onAuthorChange: (authorId: string) => void;
};

function AuthorFilter({
  authors,
  selectedAuthor,
  onAuthorChange,
}: AuthorFilterProps) {
  return (
    <div className="w-full sm:w-auto">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Author
      </label>
      <select
        value={selectedAuthor}
        onChange={(e) => onAuthorChange(e.target.value)}
        className="block w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-200"
      >
        <option value="">All Authors</option>
        {authors.map((author) => (
          <option key={author._id} value={author._id}>
            {author.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AuthorFilter;
