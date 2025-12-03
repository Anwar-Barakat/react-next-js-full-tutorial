import { render, screen, fireEvent } from '@testing-library/react';
import { ChangeEventHandler } from '../components/ChangeEventHandler';

describe('ChangeEventHandler', () => {
  it('renders an input field, displays its initial value, and updates on change', () => {
    render(<ChangeEventHandler />);
    const input = screen.getByPlaceholderText('Type something...') as HTMLInputElement;

    // Check initial render
    expect(input).toBeInTheDocument();
    expect(screen.getByText('Input value:')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument(); // Initial empty state display

    // Update and display input value on change
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');
    expect(screen.getByText('Input value:').closest('p')).toHaveTextContent('Input value: Hello');

    fireEvent.change(input, { target: { value: 'World' } });
    expect(input.value).toBe('World');
    expect(screen.getByText('Input value:').closest('p')).toHaveTextContent('Input value: World');
  });
});
