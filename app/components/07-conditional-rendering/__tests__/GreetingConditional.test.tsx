import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GreetingConditional from '../components/GreetingConditional';

describe('GreetingConditional Component', () => {
  it('renders "Good morning!" when timeOfDay is "morning"', () => {
    render(<GreetingConditional timeOfDay="morning" />);
    expect(screen.getByText('Good morning! ☀️')).toBeInTheDocument();
  });

  it('renders "Good afternoon!" when timeOfDay is "afternoon"', () => {
    render(<GreetingConditional timeOfDay="afternoon" />);
    expect(screen.getByText('Good afternoon! 🌅')).toBeInTheDocument();
  });
});
