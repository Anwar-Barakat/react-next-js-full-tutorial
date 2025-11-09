interface ProductProps {
  name: string;
  price: string;
}

const Product = (props: ProductProps) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold">Product: {props.name}</h2>
      <p className="mt-2">Price: {props.price}</p>
    </div>
  );
};

export default Product;