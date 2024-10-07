import { Link } from "react-router-dom";
import { BookType } from "../../../backend/src/shared/types";
import { Spotlight } from "./aceternity-ui/Spotlight";
import { cn } from "../lib/utills";

interface BookCardProps {
  book: BookType;
}

function BookCardHome({ book }: BookCardProps) {
  return (
    <div className="h-auto md:h-[40rem] w-full rounded-md flex flex-col md:flex-row bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Top (on small screens) / Left (on larger screens): Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <img
          className="h-[20rem] md:h-[80%] w-auto object-cover rounded-md"
          src={book.coverPageUrl}
          alt="CoverPage"
        />
      </div>

      {/* Bottom (on small screens) / Right (on larger screens): Text Details */}
      <div className="w-full md:w-1/2 p-4 max-w-7xl mx-auto relative z-10 flex flex-col justify-center">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          {book.title}
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          {book.description.slice(0, 305)}...
        </p>

        {/* Buttons Section */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to={`/books/${book._id}`}
            className={cn(
              "bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-full shadow-lg",
              "hover:from-purple-500 hover:to-indigo-500 transition-transform duration-300 transform hover:scale-105"
            )}
          >
            Read Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCardHome;
