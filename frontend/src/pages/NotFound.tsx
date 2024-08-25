import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">404 Not Found</h2>
      <Link
        to="/"
        className="bg-indigo-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
      >
        Home
      </Link>
    </div>
  );
}

export default NotFound;
