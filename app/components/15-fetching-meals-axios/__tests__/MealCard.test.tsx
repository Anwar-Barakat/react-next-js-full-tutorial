import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MealCard from '../components/MealCard';
import Image from 'next/image';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} />;
  },
}));

describe('MealCard Component', () => {
  const mockMeal = {
    id: 1,
    name: 'Spaghetti Carbonara',
    image: '/images/carbonara.jpg',
    instructions: ['Cook pasta.', 'Prepare sauce.'],
  };

  it('renders meal name, image, and truncated instructions', () => {
    render(<MealCard meal={mockMeal} />);

    // Check if meal name is rendered
    expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();

    // Check if image is rendered with correct props
    const imageElement = screen.getByAltText('Spaghetti Carbonara');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', '/images/carbonara.jpg');
    expect(imageElement).toHaveAttribute('width', '500');
    expect(imageElement).toHaveAttribute('height', '500');

    // Check if truncated instructions are rendered
    expect(screen.getByText('Cook pasta....')).toBeInTheDocument();
  });
});
