import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from '../components/Counter';

describe('Counter Component (useReducer)', () => {
  it('renders initial count of 0', () => {
    render(<Counter />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increments count when "Increment" button is clicked', () => {
    render(<Counter />);
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('decrements count when "Decrement" button is clicked', () => {
    render(<Counter />);
    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    fireEvent.click(decrementButton);
    expect(screen.getByText('-1')).toBeInTheDocument(); // Initial count is 0, so 0 - 1 = -1
  });

  it('resets count when "Reset" button is clicked', () => {
    render(<Counter />);
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });

    fireEvent.click(incrementButton); // count becomes 1
    fireEvent.click(incrementButton); // count becomes 2
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
