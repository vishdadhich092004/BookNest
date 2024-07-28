import SocialIcon from "../SocialIcon";
import FooterLink from "./FooterLink";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm mb-4 md:mb-0">
            © {currentYear} Book<span className="text-indigo-600">Nest</span>.
            All rights reserved.
          </div>

          <div className="flex space-x-6 mb-4 md:mb-0">
            <FooterLink href="#" label="Privacy Policy" />
            <FooterLink href="#" label="Terms of Service" />
            <FooterLink href="#" label="Contact" />
          </div>

          <div className="flex space-x-4">
            <SocialIcon href="#" icon="facebook" />
            <SocialIcon href="#" icon="twitter" />
            <SocialIcon href="#" icon="instagram" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
