import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconComponent from '../components/IconComponent';

// Mocking react-icons/fa to avoid issues with SVG rendering in JSDOM
jest.mock('react-icons/fa', () => ({
  FaBeer: () => <svg data-testid="fa-beer-icon" />,
}));

describe('IconComponent', () => {
  it('renders the title "Icon Component"', () => {
    render(<IconComponent />);
    expect(screen.getByText('Icon Component')).toBeInTheDocument();
  });

  it('renders the FaBeer icon', () => {
    render(<IconComponent />);
    expect(screen.getByTestId('fa-beer-icon')).toBeInTheDocument();
  });
});
