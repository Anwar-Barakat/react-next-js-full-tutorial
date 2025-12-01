import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CounterEffect from '../components/CounterEffect';

describe('CounterEffect Component', () => {
  const originalDocumentTitle = document.title;

  afterEach(() => {
    document.title = originalDocumentTitle; // Restore original document title
  });

  it('renders initial count and updates document title', () => {
    render(<CounterEffect />);
    expect(screen.getByText('Current count: 0')).toBeInTheDocument();
    expect(document.title).toBe('Count: 0');
  });

  it('increments count and updates document title on button click', () => {
    render(<CounterEffect />);
    const incrementButton = screen.getByRole('button', { name: /increment/i });

    fireEvent.click(incrementButton);
    expect(screen.getByText('Current count: 1')).toBeInTheDocument();
    expect(document.title).toBe('Count: 1');

    fireEvent.click(incrementButton);
    expect(screen.getByText('Current count: 2')).toBeInTheDocument();
    expect(document.title).toBe('Count: 2');
  });
});
