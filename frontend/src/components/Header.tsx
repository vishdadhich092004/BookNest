import { Link } from "react-router-dom";
import SignOutButton from "./Buttons/SignOutButton";
import { useAuth } from "../contexts/AuthContext";
import { FaRegUser } from "react-icons/fa6";

const Header = () => {
  const { isAuthenticated, user } = useAuth();

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
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/discussions">Discussions</NavLink>
            <NavLink to="/books">Books</NavLink>
          </nav>
          {/* User Greeting and Auth Buttons */}
          <div className="flex items-center space-x-6">
            {isAuthenticated && user && (
              <span className="hidden md:flex items-center text-slate-600">
                <FaRegUser className="text-xl mr-2 text-teal-600" />
                <span className="text-sm font-medium">{user.firstName}</span>
              </span>
            )}
            {isAuthenticated ? <SignOutButton /> : <SignInButton />}
          </div>
        </div>
      </div>
    </header>
  );
};
type navProps = {
  to: string;
  children: string;
};

const NavLink = ({ to, children }: navProps) => (
  <Link
    to={to}
    className="text-slate-600 hover:text-teal-600 transition-colors duration-300 text-sm uppercase tracking-wide"
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
