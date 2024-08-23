import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex justify-evenly items-center mt-40">
      <h2 className="text-4xl">404 Not Found</h2>
      <Link
        to="/"
        className=" bg-indigo-600 w-15 text-white py-2 rounded-md shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
      >
        Home
      </Link>
    </div>
  );
}

export default NotFound;
