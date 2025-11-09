const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <p>© {year} My Website</p>
    </footer>
  );
};

export default Footer;