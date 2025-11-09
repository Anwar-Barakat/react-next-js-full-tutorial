const ProductInfo = () => {
  const product = {
    name: "Laptop",
    price: 1200,
    availability: "In stock",
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold">Product Details</h2>
      <p className="mt-2">Name: {product.name}</p>
      <p className="mt-2">Price: ${product.price}</p>
      <p className="mt-2">Availability: {product.availability}</p>
    </div>
  );
};

export default ProductInfo;
