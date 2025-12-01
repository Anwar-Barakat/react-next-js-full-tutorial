import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormWithRef } from '../components/FormWithRef';

describe('FormWithRef Component', () => {
  it('renders input fields and a submit button', () => {
    render(<FormWithRef />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('displays submitted data and clears inputs after submission', async () => {
    render(<FormWithRef />);
    const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name: Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Email: jane.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Password: password123')).toBeInTheDocument();
    });

    // Ensure inputs are cleared
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });

  it('does not display submitted data initially', () => {
    render(<FormWithRef />);
    expect(screen.queryByText('Submitted Data:')).not.toBeInTheDocument();
  });
});
