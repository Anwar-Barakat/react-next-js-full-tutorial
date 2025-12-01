import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ValidationForm } from '../components/ValidationForm';
import { AlertCircle } from 'lucide-react';

// Mock the AlertCircle component from lucide-react
jest.mock('lucide-react', () => ({
  AlertCircle: () => <svg data-testid="alert-circle-icon" />,
}));

describe('ValidationForm Component', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders all form fields and a submit button', () => {
    render(<ValidationForm />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty fields on submit', async () => {
    render(<ValidationForm />);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('error-username')).toHaveTextContent('Username must be at least 8 characters');
      expect(await screen.findByTestId('error-email')).toHaveTextContent('Email must be a valid address');
      expect(await screen.findByTestId('error-password')).toHaveTextContent('Password should be at least 8 characters');
      expect(await screen.findByTestId('error-confirm-password')).toHaveTextContent('Passwords do not match');
    });
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('displays error for short username', async () => {
    render(<ValidationForm />);
    const usernameInput = screen.getByPlaceholderText('Username');
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });
    await waitFor(async () => {
      expect(await screen.findByTestId('error-username')).toHaveTextContent('Username must be at least 8 characters');
    });
  });

  it('displays error for invalid email format', async () => {
    render(<ValidationForm />);
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'a@b' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(async () => {
      expect(await screen.findByTestId('error-email')).toHaveTextContent('Email must be a valid address');
    });
  });

  it('displays error for short password', async () => {
    render(<ValidationForm />);
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });
    await waitFor(async () => {
      expect(await screen.findByTestId('error-password')).toHaveTextContent('Password should be at least 8 characters');
    });
  });

  it('displays error when passwords do not match', async () => {
    render(<ValidationForm />);
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

    fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });
    await waitFor(async () => {
      expect(await screen.findByTestId('error-confirm-password')).toHaveTextContent('Passwords do not match');
    });
  });

  it('submits successfully with valid data', async () => {
    render(<ValidationForm />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(usernameInput, { target: { value: 'validusername' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'validpassword' } });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Form submitted successfully!');
    });

    // Ensure form fields are cleared
    expect((usernameInput as HTMLInputElement).value).toBe('');
    expect((emailInput as HTMLInputElement).value).toBe('');
    expect((passwordInput as HTMLInputElement).value).toBe('');
    expect((confirmPasswordInput as HTMLInputElement).value).toBe('');

    // Ensure error messages are cleared
    expect(screen.queryByTestId('error-username')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-password')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-confirm-password')).not.toBeInTheDocument();
  });
});
