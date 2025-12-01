import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JSXRules from '../components/JSXRules';

describe('JSXRules Component', () => {
  it('renders the title "JSX Rules"', () => {
    render(<JSXRules />);
    expect(screen.getByText('JSX Rules')).toBeInTheDocument();
  });

  it('renders the list of JSX rules', () => {
    render(<JSXRules />);
    expect(screen.getByText('JSX must return a single parent element.')).toBeInTheDocument();
    expect(screen.getByText('JSX elements must be properly closed.')).toBeInTheDocument();
    expect(screen.getByText('JSX attributes are written using camelCase (e.g., className instead of class).')).toBeInTheDocument();
  });
});
