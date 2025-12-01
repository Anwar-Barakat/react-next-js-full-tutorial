import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserProvider } from '../components/UserContext';
import UserProfile from '../components/UserProfile';
import UpdateUser from '../components/UpdateUser';

describe('User Context Integration', () => {
  it('displays initial user name in UserProfile and updates it via UpdateUser', () => {
    render(
      <UserProvider>
        <UserProfile />
        <UpdateUser />
      </UserProvider>
    );

    // Assert initial state
    const nameLabelSpan = screen.getByText('Name:', { selector: 'span' });
    expect(nameLabelSpan.closest('p')).toHaveTextContent('Name: John Doe');

    // Update user name
    const nameInput = screen.getByPlaceholderText('New name');
    const updateButton = screen.getByRole('button', { name: /update name/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.click(updateButton);

    // Assert updated state
    const updatedNameLabelSpan = screen.getByText('Name:', { selector: 'span' });
    expect(updatedNameLabelSpan.closest('p')).toHaveTextContent('Name: Jane Smith');

    expect((nameInput as HTMLInputElement).value).toBe(''); // Input should be cleared
  });

  it('UserProfile shows loading state when context is undefined (not wrapped in Provider)', () => {
    // Temporarily mock useContext to return undefined for this specific test
    // This is generally not how you test context in practice, but for demonstrating
    // the loading state when context is not available, it serves the purpose.
    jest.spyOn(React, 'useContext').mockReturnValueOnce(undefined);

    render(<UserProfile />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
