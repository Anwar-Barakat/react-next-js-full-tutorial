const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gradient-to-br from-[var(--card)] to-[var(--muted)]/30 border-t border-[var(--border)] py-8 md:py-10 shadow-[var(--shadow-md)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="center-content flex-col gap-2">
          <p className="text-[var(--muted-foreground)] center-text text-sm md:text-base">
            © {year} My Website
          </p>
          <div className="flex gap-2 items-center">
            <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-[var(--secondary)] rounded-full"></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;