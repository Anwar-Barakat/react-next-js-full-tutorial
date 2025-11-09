const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <h1 className="text-3xl font-bold">Welcome to My Website!</h1>
      <nav className="flex gap-4 mt-2">
        <a href="#" className="hover:text-gray-300">Home</a>
        <a href="#" className="hover:text-gray-300">About</a>
        <a href="#" className="hover:text-gray-300">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
