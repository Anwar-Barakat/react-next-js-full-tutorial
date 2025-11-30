const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="glass border-t border-glass-border py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="center-content flex-col gap-2">
          <p className="text-muted-foreground center-text text-sm md:text-base">
            © {year} My Website
          </p>
          <div className="flex gap-2 items-center">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;