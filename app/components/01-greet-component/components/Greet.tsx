const Greet = () => {
  return (
    <div className="center-container">
      <div className="text-center space-y-6 animate-in fade-in duration-500">
        <div className="inline-block p-4 bg-muted rounded-2xl mb-4">
          <span className="text-5xl">👋</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-foreground center-text animate-pulse">
          Hello, World!
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
          Welcome to modern React development
        </p>
      </div>
    </div>
  );
};

export default Greet;