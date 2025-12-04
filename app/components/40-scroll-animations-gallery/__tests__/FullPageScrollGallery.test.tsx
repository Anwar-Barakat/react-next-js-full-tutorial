import { render, screen } from '@testing-library/react';
import FullPageScrollGallery from '../components/FullPageScrollGallery';

// Mock framer-motion hooks as they rely on browser APIs and actual DOM interactions
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'), // Use actual for other exports
  motion: {
    div: ({ children, style, ...rest }: any) => <div {...rest} style={style}>{children}</div>,
  },
  useScroll: jest.fn(() => ({ scrollYProgress: { get: () => 0, onChange: jest.fn() } })),
  useTransform: jest.fn(() => ({ get: () => '0%', onChange: jest.fn() })),
  useSpring: jest.fn(() => ({ get: () => '0%', onChange: jest.fn() })),
}));

describe('FullPageScrollGallery', () => {
  it('renders main headings and image elements', () => {
    render(<FullPageScrollGallery />);

    // Assert main headings are present
    expect(screen.getByText('Scroll Down for Magic')).toBeInTheDocument();
    expect(screen.getByText('End of the Journey')).toBeInTheDocument();

    // Assert images are present
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(5); // Based on the 'images' array in the component
    expect(screen.getByAltText('Gallery Image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Gallery Image 5')).toBeInTheDocument();
  });
});
