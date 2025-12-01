import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../components/Profile';

describe('Profile Component', () => {
  it('renders initial profile information', () => {
    render(<Profile />);
    const nameSpan = screen.getByText('Name:', { selector: 'span' });
    expect(nameSpan.closest('p')).toHaveTextContent('Name: John Doe');

    const ageSpan = screen.getByText('Age:', { selector: 'span' });
    expect(ageSpan.closest('p')).toHaveTextContent('Age: 30');
  });

  it('updates name when input is changed', () => {
    render(<Profile />);
    const nameInput = screen.getByPlaceholderText('Enter name') as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    const updatedNameSpan = screen.getByText('Name:', { selector: 'span' });
    expect(updatedNameSpan.closest('p')).toHaveTextContent('Name: Jane Smith');
  });

  it('updates age when input is changed', () => {
    render(<Profile />);
    const ageInput = screen.getByPlaceholderText('Enter age') as HTMLInputElement;

    fireEvent.change(ageInput, { target: { value: '25' } });
    const updatedAgeSpan = screen.getByText('Age:', { selector: 'span' });
    expect(updatedAgeSpan.closest('p')).toHaveTextContent('Age: 25');
  });
});
