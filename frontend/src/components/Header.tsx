const Header = () => {
  return (
    <header className="bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold text-gray-800">
            <span className="inline-block transform hover:scale-105 transition-transform duration-300">
              Book
            </span>
            <span className="inline-block text-indigo-600 transform hover:scale-105 transition-transform duration-300 ml-1">
              Nest
            </span>
          </div>

          <SignInButton />
        </div>
      </div>
    </header>
  );
};

const SignInButton = () => (
  <button className="px-4 py-2 bg-indigo-600 text-white rounded-sm hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105">
    Sign In
  </button>
);

export default Header;
