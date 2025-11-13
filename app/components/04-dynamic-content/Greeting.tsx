const Greeting = () => {
  const name = "John";
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4 center-text">
          Hello, {name}!
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] center-text">
          Today&apos;s date is: {currentDate}
        </p>
      </div>
    </div>
  );
};

export default Greeting;
