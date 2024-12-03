interface BookIllustrationProps {
  className: string;
}
const BookIllustration = ({ className }: BookIllustrationProps) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="200" height="200" fill="#f0f9ff" />

    {/* Bookshelf */}
    <rect x="20" y="40" width="160" height="120" fill="#8b4513" />
    <rect x="25" y="45" width="150" height="110" fill="#d2691e" />

    {/* Books */}
    <rect x="30" y="50" width="20" height="100" fill="#ff6347" />
    <rect x="55" y="50" width="25" height="100" fill="#4169e1" />
    <rect x="85" y="50" width="15" height="100" fill="#32cd32" />
    <rect x="105" y="50" width="30" height="100" fill="#ffd700" />
    <rect x="140" y="50" width="25" height="100" fill="#8a2be2" />

    {/* Book details */}
    <line x1="35" y1="60" x2="45" y2="60" stroke="white" strokeWidth="2" />
    <line x1="35" y1="70" x2="45" y2="70" stroke="white" strokeWidth="2" />
    <line x1="60" y1="60" x2="75" y2="60" stroke="white" strokeWidth="2" />
    <line x1="60" y1="70" x2="75" y2="70" stroke="white" strokeWidth="2" />
    <line x1="88" y1="60" x2="97" y2="60" stroke="white" strokeWidth="2" />
    <line x1="110" y1="60" x2="130" y2="60" stroke="white" strokeWidth="2" />
    <line x1="110" y1="70" x2="130" y2="70" stroke="white" strokeWidth="2" />
    <line x1="145" y1="60" x2="160" y2="60" stroke="white" strokeWidth="2" />
    <line x1="145" y1="70" x2="160" y2="70" stroke="white" strokeWidth="2" />

    {/* Decorative elements */}
    <circle cx="100" cy="20" r="10" fill="#ff69b4" />
    <circle cx="180" cy="180" r="15" fill="#00ced1" />
    <path
      d="M10,190 Q30,170 50,190"
      stroke="#ff8c00"
      strokeWidth="3"
      fill="none"
    />
  </svg>
);

export default BookIllustration;
