import { render, screen } from '@testing-library/react';
import FramerMotionUseMotionValue from '../components/FramerMotionUseMotionValue';

// Mock all child components
jest.mock('../DraggableBox', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-draggable-box">Mock DraggableBox</div>,
}));
jest.mock('../HoverLinkedScale', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-hover-linked-scale">Mock HoverLinkedScale</div>,
}));
jest.mock('../SpringAnimatedPosition', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-spring-animated-position">Mock SpringAnimatedPosition</div>,
}));
jest.mock('../DynamicRotation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-dynamic-rotation">Mock DynamicRotation</div>,
}));


describe('FramerMotionUseMotionValue', () => {
  it('renders all child components', () => {
    render(<FramerMotionUseMotionValue />);

    expect(screen.getByText('Framer Motion useMotionValue')).toBeInTheDocument();
    expect(screen.getByTestId('mock-draggable-box')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hover-linked-scale')).toBeInTheDocument();
    expect(screen.getByTestId('mock-spring-animated-position')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dynamic-rotation')).toBeInTheDocument();
  });
});
