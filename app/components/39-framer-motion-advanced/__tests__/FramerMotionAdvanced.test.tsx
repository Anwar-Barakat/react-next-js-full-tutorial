import { render, screen } from '@testing-library/react';
import FramerMotionAdvanced from '../components/FramerMotionAdvanced';

// Mock all child components
jest.mock('../StaggeredFadeSlideIn', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-staggered-fade-slide-in">Mock StaggeredFadeSlideIn</div>,
}));
jest.mock('../CardFlipInView', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-card-flip-in-view">Mock CardFlipInView</div>,
}));
jest.mock('../ComplexTimeline', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-complex-timeline">Mock ComplexTimeline</div>,
}));
jest.mock('../InteractiveCards', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-interactive-cards">Mock InteractiveCards</div>,
}));
jest.mock('../ScrollProgressBar', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-scroll-progress-bar">Mock ScrollProgressBar</div>,
}));
jest.mock('../LoaderAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-loader-animation">Mock LoaderAnimation</div>,
}));
jest.mock('../DraggableCards', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-draggable-cards">Mock DraggableCards</div>,
}));
jest.mock('../HorizontalScrollGallery', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-horizontal-scroll-gallery">Mock HorizontalScrollGallery</div>,
}));


describe('FramerMotionAdvanced', () => {
  it('renders all child components', () => {
    render(<FramerMotionAdvanced />);

    expect(screen.getByText('Framer Motion Advanced Examples')).toBeInTheDocument();
    expect(screen.getByTestId('mock-staggered-fade-slide-in')).toBeInTheDocument();
    expect(screen.getByTestId('mock-card-flip-in-view')).toBeInTheDocument();
    expect(screen.getByTestId('mock-complex-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('mock-interactive-cards')).toBeInTheDocument();
    expect(screen.getByTestId('mock-scroll-progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-loader-animation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-draggable-cards')).toBeInTheDocument();
    expect(screen.getByTestId('mock-horizontal-scroll-gallery')).toBeInTheDocument();
  });
});
