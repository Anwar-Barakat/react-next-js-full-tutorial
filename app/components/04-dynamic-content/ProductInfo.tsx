type ProductProps = {
  product: {
    name:string;
    price: number;
    availability: string;
  };
};

const ProductInfo = ({ product }: ProductProps) => {
  return (
    <div className="w-full max-w-sm text-center">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 glass rounded-lg">
            <p className="text-base font-semibold text-foreground">Name:</p>
            <p className="text-base text-muted-foreground">{product.name}</p>
          </div>
          <div className="flex justify-between items-center p-3 glass rounded-lg">
            <p className="text-base font-semibold text-foreground">Price:</p>
            <p className="text-base text-muted-foreground">${product.price}</p>
          </div>
          <div className="flex justify-between items-center p-3 glass rounded-lg">
            <p className="text-base font-semibold text-foreground">Availability:</p>
            <p className={`text-base font-semibold ${product.availability === "In stock" ? 'text-accent' : 'text-secondary'}`}>{product.availability}</p>
          </div>
        </div>
    </div>
  );
};

export default ProductInfo;
