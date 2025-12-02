import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContextDemo } from '../components/ContextDemo';
import { CounterProvider } from '../components/CounterContext';
import { Counter } from '../components/Counter';

// Mock child components to isolate Container's rendering
// Although Counter is already tested, we can mock it here to ensure ContextDemo's structure
jest.mock('../components/Counter', () => ({
  __esModule: true,
  Counter: () => <div data-testid="mock-counter">Mock Counter</div>,
}));

// We need to keep CounterProvider real for ContextDemo to work as intended,
// as ContextDemo wraps Counter with CounterProvider.

describe('ContextDemo Component', () => {
  it('renders Counter component within CounterProvider', () => {
    render(<ContextDemo />);

    // Check if the mocked Counter is rendered
    expect(screen.getByTestId('mock-counter')).toBeInTheDocument();
  });
});
