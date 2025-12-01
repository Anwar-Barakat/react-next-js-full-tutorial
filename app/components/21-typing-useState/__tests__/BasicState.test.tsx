import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BasicState } from '../components/BasicState';

describe('BasicState Component', () => {
  it('renders initial count of 0', () => {
    render(<BasicState />);
    expect(screen.getByText(/count:/i).closest('p')).toHaveTextContent('Count: 0');
  });

  it('increments count when button is clicked', () => {
    render(<BasicState />);
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);
    expect(screen.getByText(/count:/i).closest('p')).toHaveTextContent('Count: 1');
    fireEvent.click(incrementButton);
    expect(screen.getByText(/count:/i).closest('p')).toHaveTextContent('Count: 2');
  });
});
