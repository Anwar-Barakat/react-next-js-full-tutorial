import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Greet from '../components/Greet'; // Adjust the import path as necessary

describe('Greet Component', () => {
  it('renders "Hello, Guest!" when no name prop is provided', () => {
    render(<Greet />);
    expect(screen.getByText('Hello, Guest!')).toBeInTheDocument();
  });

  it('renders "Hello, Alice!" when name prop is "Alice"', () => {
    render(<Greet name="Alice" />);
    expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
  });

  it('renders "Hello, Bob!" when name prop is "Bob"', () => {
    render(<Greet name="Bob" />);
    expect(screen.getByText('Hello, Bob!')).toBeInTheDocument();
  });
});
