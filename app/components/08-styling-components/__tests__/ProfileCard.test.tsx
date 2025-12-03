import { render, screen } from '@testing-library/react';
import ProfileCard from '../components/ProfileCard';

describe('ProfileCard', () => {
  it('renders the profile card with a title and description', () => {
    render(<ProfileCard />);
    const title = screen.getByText('Profile Card');
    const paragraph = screen.getByText('This card is styled with Tailwind CSS.');

    expect(title).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
  });
});
