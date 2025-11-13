const ProductInfo = () => {
  const product = {
    name: "Laptop",
    price: 1200,
    availability: "In stock",
  };

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 center-text">
          Product Details
        </h2>
        <div className="space-y-3">
          <p className="text-lg text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--foreground)]">Name:</span> {product.name}
          </p>
          <p className="text-lg text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--foreground)]">Price:</span> ${product.price}
          </p>
          <p className="text-lg text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--foreground)]">Availability:</span> {product.availability}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
