import { Link } from "react-router-dom";
import { cn } from "../../lib/utills";
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

export default SignInButton;
