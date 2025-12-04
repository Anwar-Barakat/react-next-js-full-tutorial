import { render, screen } from '@testing-library/react';
import { FormWithRef } from '../components/FormWithRef';

describe('FormWithRef', () => {
  it('renders input fields and a submit button', () => {
    render(<FormWithRef />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('does not display submitted data initially', () => {
    render(<FormWithRef />);
    expect(screen.queryByText('Submitted Data:')).not.toBeInTheDocument();
  });
});
