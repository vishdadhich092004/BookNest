import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function HeroSection() {
  const { isAuthenticated } = useAuth();
  const toLink = isAuthenticated ? "/discussions" : "/sign-in";
  return (
    <section className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to BookNest
        </h1>
        <p className="text-xl mb-8">
          Connect, discuss, and explore books with fellow readers
        </p>
        <Link
          to={toLink}
          className="bg-white text-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-teal-100 transition duration-300"
        >
          {isAuthenticated ? "Start" : "Join Now"}
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
