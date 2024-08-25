import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
function CallToActionSection() {
  const { isAuthenticated } = useAuth();
  const toLink = isAuthenticated ? "/discussions" : "sign-in";
  return (
    <section className="bg-teal-600 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to start your reading journey?
        </h2>
        <p className="text-xl mb-8">
          Join BookNest today and connect with book lovers around the world.
        </p>
        <Link
          to={toLink}
          className="bg-white text-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-teal-100 transition duration-300"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}

export default CallToActionSection;
