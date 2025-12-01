import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductInfo from '../components/ProductInfo';

describe('ProductInfo Component', () => {
  const mockProduct = {
    name: 'Test Product',
    price: 99.99,
    availability: 'In stock',
  };

  it('renders product name, price, and availability', () => {
    render(<ProductInfo product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('In stock')).toBeInTheDocument();
  });

  it('renders "Out of stock" availability correctly', () => {
    const outOfStockProduct = { ...mockProduct, availability: 'Out of stock' };
    render(<ProductInfo product={outOfStockProduct} />);

    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });
});
