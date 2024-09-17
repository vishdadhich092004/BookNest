import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { cn } from "../../lib/utills";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent w-full">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="text-white text-2xl font-bold tracking-wider mb-4 md:mb-0">
            <Link to="/">BookNest</Link>
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-wrap justify-center space-x-4 md:space-x-8 mb-4 md:mb-0">
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </ul>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <SocialIcon
              href="https://www.facebook.com/profile.php?id=61565048666364"
              icon={<FaFacebookF />}
            />
            <SocialIcon href="https://x.com/booknestweb" icon={<FaTwitter />} />
            <SocialIcon
              href="https://www.instagram.com/booknestweb/"
              icon={<FaInstagram />}
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-white text-sm text-center mt-8">
          © {currentYear} BookNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

type FooterLinkProps = {
  to: string;
  children: React.ReactNode;
};

const FooterLink = ({ to, children }: FooterLinkProps) => (
  <li>
    <Link
      to={to}
      className={cn(
        "text-white text-lg font-medium relative group",
        "hover:text-indigo-400 transition-all duration-300 ease-in-out"
      )}
    >
      {children}
      <span
        className={cn(
          "absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500",
          "transition-all duration-300 ease-in-out group-hover:w-full"
        )}
      />
    </Link>
  </li>
);

type SocialIconProps = {
  href: string;
  icon: React.ReactNode;
};

const SocialIcon = ({ href, icon }: SocialIconProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "text-white hover:text-indigo-400 transition-colors duration-300",
      "w-8 h-8 rounded-full flex items-center justify-center"
    )}
  >
    {icon}
  </a>
);

export default Footer;
