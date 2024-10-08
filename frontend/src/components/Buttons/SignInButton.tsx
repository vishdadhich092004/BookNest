import { Link } from "react-router-dom";
import { cn } from "../../lib/utills";
const SignInButton = () => (
  <Link
    to="/sign-in"
    className={cn(
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full",
      "hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center",
      "font-semibold text-sm sm:text-base"
    )}
  >
    Sign In
  </Link>
);

export default SignInButton;
