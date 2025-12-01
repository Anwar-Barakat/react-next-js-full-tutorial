import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Product from '../components/Product';

describe('Product Component', () => {
  it('renders product name and price', () => {
    render(<Product name="Laptop" price="$1200" />);

    expect(screen.getByText('Product: Laptop')).toBeInTheDocument();
    expect(screen.getByText('Price: $1200')).toBeInTheDocument();
  });
});
