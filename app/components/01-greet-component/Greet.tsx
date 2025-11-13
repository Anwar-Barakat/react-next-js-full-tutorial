const Greet = () => {
  return (
    <div className="center-container bg-gradient-to-br from-[var(--background)] via-[var(--muted)]/30 to-[var(--background)]">
      <div className="text-center space-y-6 animate-in fade-in duration-500">
        <div className="inline-block p-4 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-2xl mb-4 shadow-[var(--shadow-lg)]">
          <span className="text-5xl">👋</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent center-text animate-pulse">
          Hello, World!
        </h1>
        <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-md mx-auto">
          Welcome to modern React development
        </p>
      </div>
    </div>
  );
};

export default Greet;