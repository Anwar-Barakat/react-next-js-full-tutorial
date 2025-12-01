import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainContent from '../components/MainContent';

describe('MainContent Component', () => {
  it('renders the main content title', () => {
    render(<MainContent />);
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('renders the main content paragraph', () => {
    render(<MainContent />);
    expect(screen.getByText('This is the main content of the page.')).toBeInTheDocument();
  });
});
