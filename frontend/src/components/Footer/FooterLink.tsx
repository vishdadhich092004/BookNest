type Props = {
  href: string;
  label: string;
};

const FooterLink = ({ href, label }: Props) => (
  <a
    href={href}
    className="text-slate-600 hover:text-teal-600 transition-colors duration-300 text-sm"
  >
    {label}
  </a>
);

export default FooterLink;
