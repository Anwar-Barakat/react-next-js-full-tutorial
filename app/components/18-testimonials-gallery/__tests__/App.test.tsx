import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../App';
import { Testimonials } from '../components/Testimonials';
import { Gallery } from '../components/Gallery';

// Mock child components to isolate App's rendering
jest.mock('../components/Testimonials', () => ({
  __esModule: true,
  Testimonials: () => <div data-testid="mock-testimonials">Mock Testimonials</div>,
}));

jest.mock('../components/Gallery', () => ({
  __esModule: true,
  Gallery: () => <div data-testid="mock-gallery">Mock Gallery</div>,
}));

describe('App Component', () => {
  it('renders Testimonials and Gallery components', () => {
    render(<App />);

    expect(screen.getByTestId('mock-testimonials')).toBeInTheDocument();
    expect(screen.getByTestId('mock-gallery')).toBeInTheDocument();
  });
});
