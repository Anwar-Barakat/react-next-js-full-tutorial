import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserProfile } from '../components/UserProfile';

describe('UserProfile Component', () => {
  it('renders initial user profile information', () => {
    render(<UserProfile />);
    const nameSpan = screen.getByText('Name:', { selector: 'span' });
    expect(nameSpan.closest('p')).toHaveTextContent('Name: Alice Smith');

    const ageSpan = screen.getByText('Age:', { selector: 'span' });
    expect(ageSpan.closest('p')).toHaveTextContent('Age: 30');

    const emailSpan = screen.getByText('Email:', { selector: 'span' });
    expect(emailSpan.closest('p')).toHaveTextContent('Email: alice.smith@example.com');
  });

  it('updates age when "Celebrate Birthday!" button is clicked', () => {
    render(<UserProfile />);
    const celebrateButton = screen.getByRole('button', { name: /celebrate birthday!/i });
    
    fireEvent.click(celebrateButton);
    const updatedAgeSpan1 = screen.getByText('Age:', { selector: 'span' });
    expect(updatedAgeSpan1.closest('p')).toHaveTextContent('Age: 31');

    fireEvent.click(celebrateButton);
    const updatedAgeSpan2 = screen.getByText('Age:', { selector: 'span' });
    expect(updatedAgeSpan2.closest('p')).toHaveTextContent('Age: 32');
  });
});
