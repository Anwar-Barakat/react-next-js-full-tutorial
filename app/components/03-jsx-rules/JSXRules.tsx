const JSXRules = () => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h1 className="text-2xl font-bold mb-2">JSX Rules</h1>
      <p className="mt-2">
        <ul className="list-disc ml-5">
          <li className="mb-1">JSX must return a single parent element.</li>
          <li className="mb-1">JSX elements must be properly closed.</li>
          <li className="mb-1">JSX attributes are written using camelCase (e.g., className instead of class).</li>
        </ul>
      </p>
    </div>
  );
};

export default JSXRules;
