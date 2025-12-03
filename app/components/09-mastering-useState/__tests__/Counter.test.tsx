import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../components/Counter';

describe('Counter', () => {
  it('renders initial count and increments it on button click', () => {
    render(<Counter />);

    // Check initial count
    expect(screen.getByText('0')).toBeInTheDocument();

    // Increment count and check
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();

    // Increment again and check
    fireEvent.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
