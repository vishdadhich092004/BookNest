type Props = {
  href: string;
  label: string;
};
const FooterLink = ({ href, label }: Props) => (
  <a
    href={href}
    className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm"
  >
    {label}
  </a>
);
export default FooterLink;
