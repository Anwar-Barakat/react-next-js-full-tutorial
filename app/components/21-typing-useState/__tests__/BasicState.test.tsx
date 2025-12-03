import { render, fireEvent, within } from '@testing-library/react';
import { BasicState } from '../components/BasicState';

describe('BasicState', () => {
  it('renders initial count and increments it on button click', () => {
    const { container } = render(<BasicState />);

    // Check initial count
    expect(within(container).getByText(/Count:/)).toHaveTextContent('Count: 0');

    // Increment count and check
    const incrementButton = within(container).getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);
    expect(within(container).getByText(/Count:/)).toHaveTextContent('Count: 1');

    // Increment again and check
    fireEvent.click(incrementButton);
    expect(within(container).getByText(/Count:/)).toHaveTextContent('Count: 2');
  });
});
