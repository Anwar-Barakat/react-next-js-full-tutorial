import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Greeting from '../components/Greeting';

describe('Greeting Component', () => {
  it('renders "Hello, John!"', () => {
    render(<Greeting />);
    expect(screen.getByText('Hello, John!')).toBeInTheDocument();
  });

  it('renders today\'s date', () => {
    render(<Greeting />);
    const currentDate = new Date().toLocaleDateString();
    expect(screen.getByText(`Today's date is: ${currentDate}`)).toBeInTheDocument();
  });
});
