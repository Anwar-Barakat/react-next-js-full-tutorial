const Header = () => {
  return (
    <header className="bg-[var(--card)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-[var(--shadow-lg)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold heading-gradient mb-6">
          Welcome to My Website!
        </h1>
        <nav className="flex flex-wrap gap-4 md:gap-6">
          <a 
            href="#" 
            className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all duration-300 font-semibold px-4 py-2 rounded-xl hover:bg-[var(--muted)]/50 hover:scale-105"
          >
            Home
          </a>
          <a 
            href="#" 
            className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all duration-300 font-semibold px-4 py-2 rounded-xl hover:bg-[var(--muted)]/50 hover:scale-105"
          >
            About
          </a>
          <a 
            href="#" 
            className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all duration-300 font-semibold px-4 py-2 rounded-xl hover:bg-[var(--muted)]/50 hover:scale-105"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
