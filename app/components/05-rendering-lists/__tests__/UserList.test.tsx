import { render, screen } from '@testing-library/react';
import UserList from '../components/UserList';
// import { User as UserIcon } from 'lucide-react'; // Import the icon for testing

// Mock the lucide-react User icon
jest.mock('lucide-react', () => ({
  User: () => <div data-testid="lucide-user-icon" />,
}));

describe('UserList', () => {
  const mockUsers = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];

  it('renders a list of users with their names, emails, and user icons', () => {
    render(<UserList users={mockUsers} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();

    // Check for the UserIcon (assuming it's rendered as an SVG or has an accessible name)
    const userIcons = screen.getAllByTestId('lucide-user-icon'); // Use data-testid for the mocked icon
    expect(userIcons).toHaveLength(mockUsers.length);
  });

  it('renders no users when the users array is empty', () => {
    render(<UserList users={[]} />);
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.queryByTestId('lucide-user-icon')).not.toBeInTheDocument();
  });
});
