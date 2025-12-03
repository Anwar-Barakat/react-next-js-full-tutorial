import { render, fireEvent, within } from '@testing-library/react';
import Profile from '../components/Profile';

describe('Profile', () => {
  it('renders initial profile information', () => {
    const { container } = render(<Profile />);

    const nameSpan = within(container).getByText('Name:');
    expect(nameSpan.parentElement).toHaveTextContent('Name: John Doe');

    const ageSpan = within(container).getByText('Age:');
    expect(ageSpan.parentElement).toHaveTextContent('Age: 30');
  });

  it('updates name and age when input fields are changed', () => {
    const { container } = render(<Profile />);
    const nameInput = within(container).getByPlaceholderText('Enter name') as HTMLInputElement;
    const ageInput = within(container).getByPlaceholderText('Enter age') as HTMLInputElement;

    // Update name
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    const updatedNameSpan = within(container).getByText('Name:');
    expect(updatedNameSpan.parentElement).toHaveTextContent('Name: Jane Smith');
    expect(nameInput.value).toBe('Jane Smith'); // Check input value directly

    // Update age
    fireEvent.change(ageInput, { target: { value: '25' } });
    const updatedAgeSpan = within(container).getByText('Age:');
    expect(updatedAgeSpan.parentElement).toHaveTextContent('Age: 25');
    expect(ageInput.value).toBe('25'); // Check input value directly
  });
});
