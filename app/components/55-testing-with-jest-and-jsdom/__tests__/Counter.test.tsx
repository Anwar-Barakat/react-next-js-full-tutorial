import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Counter } from '../components/Counter';

describe('Counter', () => {
  test('renders with initial count of 0', () => {
    render(<Counter />);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0');
  });

  test('increments count when button is clicked', () => {
    render(<Counter />);
    const button = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(button);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 1');
    fireEvent.click(button);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 2');
  });
});
