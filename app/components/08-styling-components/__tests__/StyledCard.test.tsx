import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StyledCard from '../components/StyledCard';

describe('StyledCard Component', () => {
  it('renders the title "Styled Card"', () => {
    render(<StyledCard />);
    expect(screen.getByText('Styled Card')).toBeInTheDocument();
  });

  it('renders the descriptive paragraph', () => {
    render(<StyledCard />);
    expect(screen.getByText('This card is styled with Tailwind CSS.')).toBeInTheDocument();
  });
});
