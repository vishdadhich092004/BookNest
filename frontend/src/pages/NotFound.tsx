import { Link } from "react-router-dom";
import { cn } from "../lib/utills"; // Adjust the import path as needed

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-transparent text-center">
      <h1 className="text-5xl font-bold text-red-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
      <p className="text-gray-100 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className={cn(
          "bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg",
          "hover:from-purple-500 hover:to-indigo-500 transition-transform duration-300 transform hover:scale-105"
        )}
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
