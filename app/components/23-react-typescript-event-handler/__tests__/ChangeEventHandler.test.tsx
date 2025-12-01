import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChangeEventHandler } from '../components/ChangeEventHandler';

describe('ChangeEventHandler Component', () => {
  it('renders an input field and displays its value', () => {
    render(<ChangeEventHandler />);
    const input = screen.getByPlaceholderText('Type something...') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(screen.getByText('Input value:')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument(); // Initial empty state display
  });

  it('updates and displays input value on change', () => {
    render(<ChangeEventHandler />);
    const input = screen.getByPlaceholderText('Type something...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');
    expect(screen.getByText(/input value:/i).closest('p')).toHaveTextContent('Input value: Hello');

    fireEvent.change(input, { target: { value: 'World' } });
    expect(input.value).toBe('World');
    expect(screen.getByText(/input value:/i).closest('p')).toHaveTextContent('Input value: World');
  });
});
