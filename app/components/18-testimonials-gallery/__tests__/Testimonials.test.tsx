import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Testimonials } from '../components/Testimonials';
import Image from 'next/image';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

describe('Testimonials Component', () => {
  it('renders initial testimonial', () => {
    render(<Testimonials />);
    expect(screen.getByText('This is the best service I have ever used. Highly recommended!')).toBeInTheDocument();
    expect(screen.getByText('- Jane Doe')).toBeInTheDocument();
    expect(screen.getByAltText('Avatar of Jane Doe')).toBeInTheDocument();
  });

  it('navigates to the next testimonial on "Next" button click', () => {
    render(<Testimonials />);
    const nextButton = screen.getByRole('button', { name: /next/i });

    fireEvent.click(nextButton); // Move to John Smith
    expect(screen.getByText('A game-changer for our business. The results were phenomenal.')).toBeInTheDocument();
    expect(screen.getByText('- John Smith')).toBeInTheDocument();

    fireEvent.click(nextButton); // Move to Emily White
    expect(screen.getByText('Incredible support and a fantastic product. Five stars!')).toBeInTheDocument();
    expect(screen.getByText('- Emily White')).toBeInTheDocument();

    fireEvent.click(nextButton); // Cycle back to Jane Doe
    expect(screen.getByText('This is the best service I have ever used. Highly recommended!')).toBeInTheDocument();
  });

  it('navigates to the previous testimonial on "Back" button click', () => {
    render(<Testimonials />);
    const backButton = screen.getByRole('button', { name: /back/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    // Move to Emily White first to test back navigation from there
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    expect(screen.getByText('- Emily White')).toBeInTheDocument();

    fireEvent.click(backButton); // Move back to John Smith
    expect(screen.getByText('- John Smith')).toBeInTheDocument();

    fireEvent.click(backButton); // Move back to Jane Doe
    expect(screen.getByText('- Jane Doe')).toBeInTheDocument();

    fireEvent.click(backButton); // Cycle back to Emily White
    expect(screen.getByText('- Emily White')).toBeInTheDocument();
  });
});
