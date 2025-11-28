const MainContent = () => {
  return (
    <main className="center-content py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-card rounded-2xl p-8 md:p-12 border border-border">
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 center-text">
          Main Content
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground center-text leading-relaxed">
          This is the main content of the page.
        </p>
      </div>
    </main>
  );
};

export default MainContent;
