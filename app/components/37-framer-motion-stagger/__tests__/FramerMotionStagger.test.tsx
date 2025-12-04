import { render, screen } from '@testing-library/react';
import FramerMotionStagger from '../components/FramerMotionStagger';

// Mock all child components
jest.mock('../StaggeredListItems', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-staggered-list-items">Mock StaggeredListItems</div>,
}));
jest.mock('../StaggeredImageGallery', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-staggered-image-gallery">Mock StaggeredImageGallery</div>,
}));
jest.mock('../StaggeredButtonPress', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-staggered-button-press">Mock StaggeredButtonPress</div>,
}));
jest.mock('../StaggeredGridLayout', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-staggered-grid-layout">Mock StaggeredGridLayout</div>,
}));
jest.mock('../StaggeredTextReveal', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-staggered-text-reveal">Mock StaggeredTextReveal</div>,
}));


describe('FramerMotionStagger', () => {
  it('renders all child components', () => {
    render(<FramerMotionStagger />);

    expect(screen.getByText('Framer Motion Staggered Animations')).toBeInTheDocument();
    expect(screen.getByTestId('mock-staggered-list-items')).toBeInTheDocument();
    expect(screen.getByTestId('mock-staggered-image-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('mock-staggered-button-press')).toBeInTheDocument();
    expect(screen.getByTestId('mock-staggered-grid-layout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-staggered-text-reveal')).toBeInTheDocument();
  });
});
