import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileCard from '../components/ProfileCard';

describe('ProfileCard Component', () => {
  it('renders the title "Profile Card"', () => {
    render(<ProfileCard />);
    expect(screen.getByText('Profile Card')).toBeInTheDocument();
  });

  it('renders the descriptive paragraph', () => {
    render(<ProfileCard />);
    expect(screen.getByText('This card is styled with Tailwind CSS.')).toBeInTheDocument();
  });
});
