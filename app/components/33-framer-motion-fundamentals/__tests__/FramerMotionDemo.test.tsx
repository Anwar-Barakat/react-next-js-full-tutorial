import { render, screen } from '@testing-library/react';
import FramerMotionDemo from '../components/FramerMotionDemo';

// Mock all child components
jest.mock('../components/BasicAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-basic-animation">Mock BasicAnimation</div>,
}));
jest.mock('../components/AnimationProperties', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-animation-properties">Mock AnimationProperties</div>,
}));
jest.mock('../components/VariantsAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-variants-animation">Mock VariantsAnimation</div>,
}));
jest.mock('../components/FlippingCard', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-flipping-card">Mock FlippingCard</div>,
}));
jest.mock('../components/HoverAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-hover-animation">Mock HoverAnimation</div>,
}));
jest.mock('../components/DragAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-drag-animation">Mock DragAnimation</div>,
}));
jest.mock('../components/CardAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-card-animation">Mock CardAnimation</div>,
}));
jest.mock('../components/VariantsExample', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-variants-example">Mock VariantsExample</div>,
}));
jest.mock('../components/StaggerChildren', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-stagger-children">Mock StaggerChildren</div>,
}));
jest.mock('../components/GalleryAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-gallery-animation">Mock GalleryAnimation</div>,
}));

describe('FramerMotionDemo', () => {
  it('renders all child components', () => {
    render(<FramerMotionDemo />);

    expect(screen.getByText('Framer Motion Fundamentals')).toBeInTheDocument();
    expect(screen.getByTestId('mock-basic-animation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-animation-properties')).toBeInTheDocument();
    expect(screen.getByTestId('mock-variants-animation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-flipping-card')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hover-animation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-drag-animation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-card-animation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-variants-example')).toBeInTheDocument();
    expect(screen.getByTestId('mock-stagger-children')).toBeInTheDocument();
    expect(screen.getByTestId('mock-gallery-animation')).toBeInTheDocument();
  });
});