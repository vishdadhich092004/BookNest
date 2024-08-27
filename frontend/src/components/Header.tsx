import { useState } from "react";
import { Link } from "react-router-dom";
import SignOutButton from "./Buttons/SignOutButton";
import { useAuth } from "../contexts/AuthContext";
import { FaRegUser } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-light tracking-wider">
            <Link
              to="/"
              className="text-slate-800 hover:text-teal-600 transition-colors duration-300"
            >
              BOOK<span className="text-teal-600">NEST</span>
            </Link>
          </div>
          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-slate-600 hover:text-teal-600"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          {/* Navigation Links for Desktop */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/discussions">Discussions</NavLink>
            <NavLink to="/books">Books</NavLink>
            <NavLink to="/clubs">Clubs</NavLink>
          </nav>
          {/* User Greeting and Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && user && (
              <Link
                to={`/${user._id}`}
                className="flex items-center text-slate-600"
              >
                <FaRegUser className="text-xl mr-2 text-teal-600" />
                <span className="text-sm font-medium">{user.firstName}</span>
              </Link>
            )}
            {isAuthenticated ? <SignOutButton /> : <SignInButton />}
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <nav className="flex flex-col space-y-4">
              <NavLink to="/discussions" onClick={toggleMenu}>
                Discussions
              </NavLink>
              <NavLink to="/books" onClick={toggleMenu}>
                Books
              </NavLink>
              <NavLink to="/clubs" onClick={toggleMenu}>
                Clubs
              </NavLink>
              {isAuthenticated && user && (
                <Link
                  to={`/${user._id}`}
                  className="flex items-center text-slate-600"
                >
                  <FaRegUser className="text-xl mr-2 text-teal-600" />
                  <span className="text-sm font-medium">{user.firstName}</span>
                </Link>
              )}
              {isAuthenticated ? <SignOutButton /> : <SignInButton />}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

type navProps = {
  to: string;
  children: string;
  onClick?: () => void;
};

const NavLink = ({ to, children, onClick }: navProps) => (
  <Link
    to={to}
    className="text-slate-600 hover:text-teal-600 transition-colors duration-300 text-sm uppercase tracking-wide"
    onClick={onClick}
  >
    {children}
  </Link>
);

const SignInButton = () => (
  <Link
    to="/sign-in"
    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors duration-300 text-sm uppercase tracking-wide"
  >
    Sign In
  </Link>
);

export default Header;
