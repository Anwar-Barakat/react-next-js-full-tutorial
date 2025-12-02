import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CounterProvider } from '../components/CounterContext';
import { Counter } from '../components/Counter';

describe('Counter Component (integrated with Context)', () => {
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

    fireEvent.click(incrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();

    fireEvent.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(decrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  // This test ensures the Counter component itself renders correctly without direct interaction.
  it('renders the counter display and buttons', () => {
    // We can render Counter directly and mock its useCounter hook if we want to isolate it,
    // but here we're testing its behavior when provided by the context.
    render(
      <CounterProvider>
        <Counter />
      </CounterProvider>
    );
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrement/i })).toBeInTheDocument();
  });
});
