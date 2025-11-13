const ProductList = () => {
  const products = [
    { id: 1, name: "Phone", price: "$699" },
    { id: 2, name: "Laptop", price: "$1200" },
    { id: 3, name: "Headphones", price: "$199" },
  ];

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 center-text">
          Product List
        </h2>
        <div className="space-y-3">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors"
            >
              <p className="text-[var(--foreground)]">
                <span className="font-semibold">Name:</span> {product.name}, <span className="font-semibold">Price:</span> {product.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
