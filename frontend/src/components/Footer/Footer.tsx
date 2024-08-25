import SocialIcon from "../SocialIcon";
import FooterLink from "./FooterLink";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-600 text-sm mb-4 md:mb-0">
            © {currentYear} Book<span className="text-teal-600">Nest</span>. All
            rights reserved.
          </div>

          <div className="flex space-x-6 mb-4 md:mb-0">
            <FooterLink href="#" label="Privacy Policy" />
            <FooterLink href="#" label="Terms of Service" />
            <FooterLink href="#" label="Contact" />
          </div>

          <div className="flex space-x-4">
            <SocialIcon
              href="https://www.facebook.com/profile.php?id=61565048666364"
              icon="facebook"
            />
            <SocialIcon href="https://x.com/booknestweb" icon="twitter" />
            <SocialIcon
              href="https://www.instagram.com/booknestweb/"
              icon="instagram"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
