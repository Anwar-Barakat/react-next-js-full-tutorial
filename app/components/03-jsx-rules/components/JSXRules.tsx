const JSXRules = () => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full glass rounded-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 center-text">
          JSX Rules
        </h1>
        <ul className="list-disc list-inside space-y-3 text-muted-foreground">
          <li>JSX must return a single parent element.</li>
          <li>JSX elements must be properly closed.</li>
          <li>JSX attributes are written using camelCase (e.g., className instead of class).</li>
        </ul>
      </div>
    </div>
  );
};

export default JSXRules;
