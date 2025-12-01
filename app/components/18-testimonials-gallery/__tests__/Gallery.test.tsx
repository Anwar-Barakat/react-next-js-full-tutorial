import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Gallery } from '../components/Gallery';
import Image from 'next/image';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

describe('Gallery Component', () => {
  // Helper to get all currently displayed images by their alt text
  const getDisplayedImages = () => {
    return screen.getAllByRole('img').map(img => img.getAttribute('src'));
  };

  it('renders initial set of images', () => {
    render(<Gallery />);
    const displayedImages = getDisplayedImages();
    expect(displayedImages).toHaveLength(3); // IMAGES_PER_VIEW is 3
    expect(displayedImages).toEqual([
      'https://picsum.photos/seed/1/600/400',
      'https://picsum.photos/seed/2/600/400',
      'https://picsum.photos/seed/3/600/400',
    ]);
  });

  it('navigates to the next set of images on "Next" button click', () => {
    render(<Gallery />);
    const nextButton = screen.getByRole('button', { name: '❯' });

    fireEvent.click(nextButton);
    // After one click, images should be seed 2, 3, 4
    expect(getDisplayedImages()).toEqual([
      'https://picsum.photos/seed/2/600/400',
      'https://picsum.photos/seed/3/600/400',
      'https://picsum.photos/seed/4/600/400',
    ]);

    fireEvent.click(nextButton);
    // After another click, images should be seed 3, 4, 5
    expect(getDisplayedImages()).toEqual([
      'https://picsum.photos/seed/3/600/400',
      'https://picsum.photos/seed/4/600/400',
      'https://picsum.photos/seed/5/600/400',
    ]);
  });

  it('navigates to the previous set of images on "Back" button click', () => {
    render(<Gallery />);
    const nextButton = screen.getByRole('button', { name: '❯' });
    const backButton = screen.getByRole('button', { name: '❮' });

    // Advance a few times to get into the middle of the array
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    // Currently at 4, 5, 6

    fireEvent.click(backButton);
    // Back one step, should be 3, 4, 5
    expect(getDisplayedImages()).toEqual([
      'https://picsum.photos/seed/3/600/400',
      'https://picsum.photos/seed/4/600/400',
      'https://picsum.photos/seed/5/600/400',
    ]);

    fireEvent.click(backButton);
    // Back another step, should be 2, 3, 4
    expect(getDisplayedImages()).toEqual([
      'https://picsum.photos/seed/2/600/400',
      'https://picsum.photos/seed/3/600/400',
      'https://picsum.photos/seed/4/600/400',
    ]);
  });
});
