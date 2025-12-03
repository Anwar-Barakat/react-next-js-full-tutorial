import { render, screen } from '@testing-library/react';
import ProductList from '@/app/components/05-rendering-lists/components/ProductList';

describe('ProductList', () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Mouse', price: 25 },
  ];

  it('renders a list of products', () => {
    render(<ProductList products={mockProducts} />);

    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('$1200')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
    expect(screen.getByText('$25')).toBeInTheDocument();
  });

  it('renders no products when the products array is empty', () => {
    render(<ProductList products={[]} />);
    expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
    expect(screen.queryByText('Mouse')).not.toBeInTheDocument();
  });
});
