import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LibraryBig } from "lucide-react"; // Importing the icon
import SignOutButton from "./Buttons/SignOutButton";
import { useAuth } from "../contexts/AuthContext";
import UserDisplay from "./UserDisplay";
import { FaBars, FaTimes } from "react-icons/fa";
import { cn } from "../lib/utills";
import SignInButton from "./Buttons/SignInButton";
import NavLink from "./Navbar/NavLink";

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for dropdown

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
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
          ? "bg-black bg-opacity-70 backdrop-blur-md"
          : "bg-transparent",
        "mb-4 sm:mb-0"
      )}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo with Icon */}
        <div className="flex items-center space-x-2 text-white text-3xl font-bold tracking-wider">
          <LibraryBig
            className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400"
            aria-label="Library Icon"
          />
          <Link to="/" className="hover:text-indigo-400">
            BookNest
          </Link>
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
        </ul>

        {/* User Greeting and Auth Buttons */}
        <div className="hidden md:flex items-center space-x-6 relative">
          {isAuthenticated && user ? (
            <>
              <UserDisplay user={user} onClick={toggleDropdown} />
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-80 rounded-lg shadow-lg p-4">
                  <Link
                    to={`/${user._id}`}
                    className="block text-white hover:text-indigo-400 transition-colors duration-300"
                    onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                  >
                    My Profile
                  </Link>
                  <SignOutButton onClick={() => setIsDropdownOpen(false)} />
                </div>
              )}
            </>
          ) : (
            <SignInButton />
          )}
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

            {isAuthenticated && user && (
              <Link
                to={`/${user._id}`}
                className="flex items-center text-white hover:text-indigo-400 transition-colors duration-300 ml-2"
                onClick={toggleMenu}
              >
                <UserDisplay
                  user={user}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
              </Link>
            )}
            {isAuthenticated ? <SignOutButton /> : <SignInButton />}
          </nav>
        </div>
      )}
    </nav>
  );
};

export default Header;
