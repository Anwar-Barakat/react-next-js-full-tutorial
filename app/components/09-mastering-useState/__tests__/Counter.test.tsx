import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from '../components/Counter';

describe('Counter Component', () => {
  it('renders initial count of 0', () => {
    render(<Counter />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increments count when "+ Increment" button is clicked', () => {
    render(<Counter />);
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
    fireEvent.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
