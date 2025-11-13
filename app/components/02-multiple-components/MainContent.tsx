const MainContent = () => {
  return (
    <main className="center-content py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[var(--background)] via-[var(--muted)]/20 to-[var(--background)]">
      <div className="max-w-4xl w-full bg-[var(--card)] rounded-2xl shadow-[var(--shadow-lg)] p-8 md:p-12 border border-[var(--border)]">
        <h2 className="text-4xl md:text-5xl font-extrabold heading-gradient mb-6 center-text">
          Main Content
        </h2>
        <p className="text-lg md:text-xl text-[var(--muted-foreground)] center-text leading-relaxed">
          This is the main content of the page.
        </p>
      </div>
    </main>
  );
};

export default MainContent;
