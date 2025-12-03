import { render, screen } from '@testing-library/react';
import ProductInfo from '../components/ProductInfo';

describe('ProductInfo', () => {
  const mockProduct = {
    name: 'Test Product',
    price: 99.99,
    availability: 'In stock',
  };

  it('renders product information for an "In stock" product', () => {
    render(<ProductInfo product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('In stock')).toBeInTheDocument();
  });

  it('renders product information for an "Out of stock" product', () => {
    const outOfStockProduct = { ...mockProduct, availability: 'Out of stock' };
    render(<ProductInfo product={outOfStockProduct} />);

    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });
});
