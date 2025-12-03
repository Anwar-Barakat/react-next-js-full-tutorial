import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { CounterProvider, useCounter } from '../components/CounterContext';

// A test component to consume the context
const TestComponent = () => {
  const { count, increment, decrement } = useCounter();
  return (
    <div>
      <span data-testid="count-display">{count}</span>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

describe('CounterContext', () => {
  it('throws an error if useCounter is not used within a CounterProvider', () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow('useCounter must be used within a CounterProvider');
    
    consoleErrorSpy.mockRestore(); // Restore console.error
  });

  it('provides initial count and allows incrementing/decrementing', () => {
    render(
      <CounterProvider>
        <TestComponent />
      </CounterProvider>
    );

    const countDisplay = screen.getByTestId('count-display');
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    const decrementButton = screen.getByRole('button', { name: /decrement/i });

    expect(countDisplay).toHaveTextContent('0');

    fireEvent.click(incrementButton);
    expect(countDisplay).toHaveTextContent('1');

    fireEvent.click(incrementButton);
    expect(countDisplay).toHaveTextContent('2');

    fireEvent.click(decrementButton);
    expect(countDisplay).toHaveTextContent('1');
  });
});
