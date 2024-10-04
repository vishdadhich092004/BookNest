import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SignOutButton from "./Buttons/SignOutButton";
import { useAuth } from "../contexts/AuthContext";
import { FaRegUser } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";
import { cn } from "../lib/utills"; // Assuming you're using this for classnames

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true); // When scrolled down
      } else {
        setHasScrolled(false); // When at the top
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        "w-full z-50 fixed top-0 transition-colors duration-300",
        hasScrolled
          ? "bg-black bg-opacity-70 backdrop-blur-md" // Faded background on scroll
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-3xl font-bold tracking-wider">
          <Link to="/">BookNest</Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Navigation Links for Desktop */}
        <ul className="hidden lg:flex space-x-8">
          <NavLink to="/discussions">Discussions</NavLink>
          <NavLink to="/books">Books</NavLink>
          <NavLink to="/clubs">Clubs</NavLink>
        </ul>

        {/* User Greeting and Auth Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated && user && (
            <Link to={`/${user._id}`} className="flex items-center text-white">
              <FaRegUser className="text-xl mr-2" />
              <span className="text-sm font-medium">{user.firstName}</span>
            </Link>
          )}
          {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-black bg-opacity-80 p-4 rounded-lg shadow-lg">
          <nav className="flex flex-col space-y-4">
            <NavLink
              to="/discussions"
              onClick={toggleMenu}
              className="text-white hover:text-indigo-400 transition-colors duration-300"
            >
              Discussions
            </NavLink>
            <NavLink
              to="/books"
              onClick={toggleMenu}
              className="text-white hover:text-indigo-400 transition-colors duration-300"
            >
              Books
            </NavLink>
            <NavLink
              to="/clubs"
              onClick={toggleMenu}
              className="text-white hover:text-indigo-400 transition-colors duration-300"
            >
              Clubs
            </NavLink>
            {isAuthenticated && user && (
              <Link
                to={`/${user._id}`}
                className="flex items-center text-white hover:text-indigo-400 transition-colors duration-300 ml-2"
                onClick={toggleMenu} // Close menu on click
              >
                <FaRegUser className="text-xl mr-2" />
                <span className="text-sm font-medium">{user.firstName}</span>
              </Link>
            )}
            {isAuthenticated ? <SignOutButton /> : <SignInButton />}
          </nav>
        </div>
      )}
    </nav>
  );
};

type NavProps = {
  to: string;
  children: React.ReactNode; // Change to React.ReactNode for better flexibility
  onClick?: () => void;
  className?: string; // Make className optional
};
const NavLink = ({ to, children, onClick, className }: NavProps) => (
  <Link
    to={to}
    className={cn(
      "text-white text-lg font-medium relative group",
      "hover:text-indigo-400 transition-all duration-300 ease-in-out",
      className // Apply className here
    )}
    onClick={onClick}
  >
    {children}
    <span
      className={cn(
        "absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-in-out group-hover:w-full"
      )}
    />
  </Link>
);

const SignInButton = () => (
  <Link
    to="/sign-in"
    className={cn(
      "bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-full shadow-lg",
      "hover:from-purple-500 hover:to-indigo-500 transition-transform duration-300 transform hover:scale-105"
    )}
  >
    Sign In
  </Link>
);

export default Header;
