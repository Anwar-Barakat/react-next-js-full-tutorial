interface ProductProps {
  name: string;
  price: string;
}

const Product = (props: ProductProps) => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 center-text">
          Product: {props.name}
        </h2>
        <p className="text-lg text-muted-foreground center-text">
          Price: {props.price}
        </p>
      </div>
    </div>
  );
};

export default Product;