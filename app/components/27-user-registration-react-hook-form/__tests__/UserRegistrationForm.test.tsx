import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserRegistrationForm } from '../components/UserRegistrationForm';
import { AlertCircle, CheckCircle } from 'lucide-react';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <svg data-testid="alert-circle-icon" />,
  CheckCircle: () => <svg data-testid="check-circle-icon" />,
}));

describe('UserRegistrationForm Component', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('renders all form fields and a register button', () => {
    render(<UserRegistrationForm />);
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty fields on submit', async () => {
    render(<UserRegistrationForm />);
    const registerButton = screen.getByRole('button', { name: /register/i });

    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-fullName')).toHaveTextContent('Full Name is required');
    });
    expect(screen.queryByTestId('check-circle-icon')).not.toBeInTheDocument();
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('displays validation errors for invalid email', async () => {
    render(<UserRegistrationForm />);
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput); // Explicitly trigger blur event

    await waitFor(() => {
      expect(screen.getByTestId('error-email')).toHaveTextContent('Invalid email address');
    });
  });

  it('displays validation errors for short password and missing requirements', async () => {
    render(<UserRegistrationForm />);
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByTestId('error-password')).toHaveTextContent('Password must be at least 8 characters long');
      expect(screen.queryByText('Password must contain at least one uppercase letter')).not.toBeInTheDocument(); // Expecting only the first error message
    });
  });

  it('displays validation error when passwords do not match', async () => {
    render(<UserRegistrationForm />);
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(passwordInput, { target: { value: 'ValidPass1!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass2@' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByTestId('error-confirmPassword')).toHaveTextContent('Passwords do not match');
    });
  });

  it('submits successfully with valid data', async () => {
    render(<UserRegistrationForm />);
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const registerButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass1!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1!' } });

    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Form Data:', {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'ValidPass1!',
        confirmPassword: 'ValidPass1!',
      });
      expect(screen.getByText('Registration successful for John Doe!')).toBeInTheDocument();
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    });

    // Ensure form fields are cleared after successful submission
    expect((fullNameInput as HTMLInputElement).value).toBe('');
    expect((emailInput as HTMLInputElement).value).toBe('');
    expect((passwordInput as HTMLInputElement).value).toBe('');
    expect((confirmPasswordInput as HTMLInputElement).value).toBe('');
  });
});
