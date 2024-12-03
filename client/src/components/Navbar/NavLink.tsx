import { Link } from "react-router-dom";
import { cn } from "../../lib/utills";

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

export default NavLink;
