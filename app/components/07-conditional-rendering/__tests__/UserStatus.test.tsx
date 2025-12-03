import { render, screen } from '@testing-library/react';
import UserStatus from '../components/UserStatus';

describe('UserStatus', () => {
  it('renders "Welcome Admin!" when loggedIn and isAdmin are true', () => {
    render(<UserStatus loggedIn={true} isAdmin={true} />);
    expect(screen.getByText('Welcome Admin! 👑')).toBeInTheDocument();
  });

  it('renders "Welcome User!" when loggedIn is true and isAdmin is false', () => {
    render(<UserStatus loggedIn={true} isAdmin={false} />);
    expect(screen.getByText('Welcome User! 👋')).toBeInTheDocument();
  });

  it('renders "Please log in." when loggedIn is false', () => {
    render(<UserStatus loggedIn={false} isAdmin={false} />);
    expect(screen.getByText('Please log in. 🔒')).toBeInTheDocument();
  });
});
