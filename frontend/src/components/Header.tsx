import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LibraryBig, User, LogOut, Settings } from "lucide-react";
import SignOutButton from "./Buttons/SignOutButton";
import { useAuth } from "../contexts/AuthContext";
import UserDisplay from "./UserDisplay";
import { FaBars, FaTimes } from "react-icons/fa";
import { cn } from "../lib/utills";
import SignInButton from "./Buttons/SignInButton";
import NavLink from "./Navbar/NavLink";

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={cn(
        "w-full z-50 fixed top-0 transition-all duration-300",
        hasScrolled
          ? "bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg"
          : "bg-transparent",
        "mb-4 sm:mb-0"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo with Icon */}
        <div className="flex items-center space-x-2 text-white text-2xl sm:text-3xl font-bold tracking-wider">
          <LibraryBig
            className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400"
            aria-label="Library Icon"
          />
          <Link
            to="/"
            className="hover:text-indigo-400 transition-colors duration-300"
          >
            BookNest
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Navigation Links for Desktop */}
        <ul className="hidden lg:flex space-x-8">
          <NavLink to="/discussions">Discussions</NavLink>
          <NavLink to="/books">Books</NavLink>
        </ul>

        {/* User Greeting and Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-6 relative">
          {isAuthenticated && user ? (
            <div ref={dropdownRef} className="relative">
              <UserDisplay user={user} onClick={toggleDropdown} />
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg overflow-hidden transform origin-top-right transition-all duration-200 ease-out border border-gray-700"
                  style={{
                    opacity: isDropdownOpen ? 1 : 0,
                    transform: `scale(${isDropdownOpen ? 1 : 0.95})`,
                  }}
                >
                  <div className="py-2">
                    <Link
                      to={`/${user._id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3 text-indigo-400" />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-indigo-400" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-700 my-2"></div>
                    <SignOutButton
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LogOut className="w-4 h-4 mr-3 text-indigo-400" />
                      Sign Out
                    </SignOutButton>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-gray-800 bg-opacity-95 p-4 rounded-b-lg shadow-lg">
          <nav className="flex flex-col space-y-4">
            <NavLink
              to="/discussions"
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Discussions
            </NavLink>
            <NavLink
              to="/books"
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Books
            </NavLink>

            {isAuthenticated && user && (
              <>
                <Link
                  to={`/${user._id}`}
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  <User className="w-5 h-5 mr-2 text-indigo-400" />
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  <Settings className="w-5 h-5 mr-2 text-indigo-400" />
                  Settings
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <SignOutButton>Sign Out</SignOutButton>
            ) : (
              <SignInButton />
            )}
          </nav>
        </div>
      )}
    </nav>
  );
};

export default Header;
