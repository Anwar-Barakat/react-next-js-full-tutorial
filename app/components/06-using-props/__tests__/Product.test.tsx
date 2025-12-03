import { render, screen } from '@testing-library/react';
import Product from '../components/Product';

describe('Product', () => {
  it('renders the product\'s name and price', () => {
    render(<Product name="Laptop" price="$1200" />);

    expect(screen.getByText('Product: Laptop')).toBeInTheDocument();
    expect(screen.getByText('Price: $1200')).toBeInTheDocument();
  });
});
