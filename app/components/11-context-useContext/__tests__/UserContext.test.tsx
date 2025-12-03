import { render, screen, fireEvent } from '@testing-library/react';
import { UserProvider } from '../components/UserContext';
import UserProfile from '../components/UserProfile';
import UpdateUser from '../components/UpdateUser';
import React from 'react'; // Import React for useContext mock

describe('UserContext Integration', () => {
  it('displays initial user name in UserProfile and updates it via UpdateUser', () => {
    render(
      <UserProvider>
        <UserProfile />
        <UpdateUser />
      </UserProvider>
    );

    // Assert initial state
    expect(screen.getByText('Name:').parentElement).toHaveTextContent('Name: John Doe');

    // Update user name
    const nameInput = screen.getByPlaceholderText('New name');
    const updateButton = screen.getByRole('button', { name: /update name/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.click(updateButton);

    // Assert updated state
    expect(screen.getByText('Name:').parentElement).toHaveTextContent('Name: Jane Smith');
    expect((nameInput as HTMLInputElement).value).toBe(''); // Input should be cleared
  });

  it('UserProfile shows loading state when context is undefined (not wrapped in Provider)', () => {
    // Temporarily mock useContext to return undefined for this specific test
    jest.spyOn(React, 'useContext').mockReturnValueOnce(undefined);

    render(<UserProfile />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
