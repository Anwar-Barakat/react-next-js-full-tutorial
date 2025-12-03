import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleBgColor } from '../components/ToggleBgColor';

describe('ToggleBgColor', () => {
  it('renders a search input and a button', () => {
    render(<ToggleBgColor />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle mode/i })).toBeInTheDocument();
  });

  it('updates search term when input value changes', () => {
    render(<ToggleBgColor />);
    const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'react' } });
    expect(searchInput.value).toBe('react');
  });

  it('displays the search term dynamically', () => {
    render(<ToggleBgColor />);
    const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'testing' } });
    const searchTermElement = screen.getByText('Searching for:');
    expect(searchTermElement.closest('p')).toHaveTextContent('Searching for: testing');

    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.queryByText(/searching for:/i)).not.toBeInTheDocument();
  });

  it('button click does nothing when onClick is empty', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<ToggleBgColor />);
    const toggleButton = screen.getByRole('button', { name: /toggle mode/i });

    fireEvent.click(toggleButton);
    expect(consoleSpy).not.toHaveBeenCalled(); // Assert that no side effect (like console.log) occurred
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument(); // Ensure component state is unchanged relevant to a toggle

    consoleSpy.mockRestore();
  });
});
