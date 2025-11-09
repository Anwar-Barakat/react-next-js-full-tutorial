const ProductList = () => {
  const products = [
    { id: 1, name: "Phone", price: "$699" },
    { id: 2, name: "Laptop", price: "$1200" },
    { id: 3, name: "Headphones", price: "$199" },
  ];

  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-2">Product List</h2>
      {products.map((product) => (
        <div key={product.id} className="p-2 border-b border-gray-200">
          <p>Name: {product.name}, Price: {product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
