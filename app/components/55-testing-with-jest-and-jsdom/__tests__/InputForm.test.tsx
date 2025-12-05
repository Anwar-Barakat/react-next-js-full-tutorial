import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputForm } from '../components/InputForm';

describe('InputForm', () => {
  test('renders input field and submit button', () => {
    render(<InputForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/Enter Text:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('updates input value on change', () => {
    render(<InputForm onSubmit={() => {}} />);
    const input = screen.getByLabelText(/Enter Text:/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(input.value).toBe('New Value');
  });

  test('calls onSubmit with input value and clears input on submit', () => {
    const handleSubmit = jest.fn();
    render(<InputForm onSubmit={handleSubmit} />);
    const input = screen.getByLabelText(/Enter Text:/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: 'Test Submission' } });
    fireEvent.click(button);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith('Test Submission');
    expect(input.value).toBe(''); // Input should be cleared
  });
});
