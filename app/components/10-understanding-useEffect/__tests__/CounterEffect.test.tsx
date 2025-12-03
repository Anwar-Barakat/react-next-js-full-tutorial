import { render, screen, fireEvent } from '@testing-library/react';
import CounterEffect from '../components/CounterEffect';

describe('CounterEffect', () => {
  const originalDocumentTitle = document.title;

  afterEach(() => {
    document.title = originalDocumentTitle; // Restore original document title
  });

  it('renders initial count and updates document title, then increments and updates again', () => {
    render(<CounterEffect />);

    // Check initial state
    expect(screen.getByText('Current count: 0')).toBeInTheDocument();
    expect(document.title).toBe('Count: 0');

    // Increment count and check updates
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);
    expect(screen.getByText('Current count: 1')).toBeInTheDocument();
    expect(document.title).toBe('Count: 1');

    fireEvent.click(incrementButton);
    expect(screen.getByText('Current count: 2')).toBeInTheDocument();
    expect(document.title).toBe('Count: 2');
  });
});
