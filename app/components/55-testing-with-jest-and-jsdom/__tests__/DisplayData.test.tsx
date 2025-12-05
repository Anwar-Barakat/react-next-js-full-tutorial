import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DisplayData } from '../components/DisplayData';

describe('DisplayData', () => {
  test('renders name and age correctly', () => {
    render(<DisplayData name="Alice" age={30} />);
    expect(screen.getByRole('heading', { level: 2, name: /Name: Alice/i })).toBeInTheDocument();
    expect(screen.getByText(/Age: 30/i)).toBeInTheDocument();
  });

  test('renders name correctly when age is not provided', () => {
    render(<DisplayData name="Bob" />);
    expect(screen.getByRole('heading', { level: 2, name: /Name: Bob/i })).toBeInTheDocument();
    expect(screen.getByText(/Age: Not provided/i)).toBeInTheDocument();
  });

  test('does not render age paragraph if age is not provided and element is conditional', () => {
    render(<DisplayData name="Charlie" />);
    const ageElement = screen.queryByText(/Age:/i);
    expect(ageElement).toBeInTheDocument(); // It should be in the document because of the 'Age: Not provided' text
    expect(screen.queryByText(/Age: \d+/)).not.toBeInTheDocument(); // This confirms that the specific age number is not rendered
  });
});
