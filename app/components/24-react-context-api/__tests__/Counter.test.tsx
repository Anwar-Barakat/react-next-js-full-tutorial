import { render, screen, fireEvent } from '@testing-library/react';
import { CounterProvider } from '../components/CounterContext';
import { Counter } from '../components/Counter';

describe('Counter', () => {
  it('renders initial count from context and allows incrementing/decrementing', () => {
    render(
      <CounterProvider>
        <Counter />
      </CounterProvider>
    );

    const countDisplay = screen.getByText('0');
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    const decrementButton = screen.getByRole('button', { name: /decrement/i });

    expect(countDisplay).toBeInTheDocument(); // Initial count 0
    expect(incrementButton).toBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();

    fireEvent.click(incrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();

    fireEvent.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(decrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
