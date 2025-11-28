type Product = {
  id: number;
  name: string;
  price: number;
};

type ProductListProps = {
  products: Product[];
};

const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="w-full max-w-md space-y-3">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="p-3 rounded-lg flex justify-between items-center glass hover:shadow-lg transition-colors"
        >
          <p className="text-base font-semibold text-foreground">{product.name}</p>
          <p className="text-base text-accent font-semibold">${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
