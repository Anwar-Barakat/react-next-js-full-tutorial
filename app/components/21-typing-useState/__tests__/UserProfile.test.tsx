import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from '../components/UserProfile';

describe('UserProfile', () => {
  it('renders initial user profile information and updates age on button click', () => {
    render(<UserProfile />);

    // Check initial user profile information
    expect(screen.getByText('Name:').parentElement).toHaveTextContent('Name: Alice Smith');
    expect(screen.getByText('Age:').parentElement).toHaveTextContent('Age: 30');
    expect(screen.getByText('Email:').parentElement).toHaveTextContent('Email: alice.smith@example.com');

    // Update age when "Celebrate Birthday!" button is clicked
    const celebrateButton = screen.getByRole('button', { name: /celebrate birthday!/i });
    
    fireEvent.click(celebrateButton);
    expect(screen.getByText('Age:').parentElement).toHaveTextContent('Age: 31');

    fireEvent.click(celebrateButton);
    expect(screen.getByText('Age:').parentElement).toHaveTextContent('Age: 32');
  });
});
