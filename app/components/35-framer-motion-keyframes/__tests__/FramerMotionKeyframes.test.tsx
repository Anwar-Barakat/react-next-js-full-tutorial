import { render, screen } from '@testing-library/react';
import FramerMotionKeyframes from '../components/FramerMotionKeyframes';

// Mock all child components
jest.mock('../components/BouncingBall', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-bouncing-ball">Mock BouncingBall</div>,
}));
jest.mock('../components/PulsatingButton', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-pulsating-button">Mock PulsatingButton</div>,
}));
jest.mock('../components/ColorChangeSquare', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-color-change-square">Mock ColorChangeSquare</div>,
}));
jest.mock('../components/SlidingText', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-sliding-text">Mock SlidingText</div>,
}));
jest.mock('../components/ZigzagBox', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-zigzag-box">Mock ZigzagBox</div>,
}));
jest.mock('../components/WaveEffect', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-wave-effect">Mock WaveEffect</div>,
}));
jest.mock('../components/BackgroundAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-background-animation">Mock BackgroundAnimation</div>,
}));


describe('FramerMotionKeyframes', () => {
  it('renders all child components', () => {
    render(<FramerMotionKeyframes />);

    expect(screen.getByText('Framer Motion Keyframe Animations')).toBeInTheDocument();
    expect(screen.getByTestId('mock-bouncing-ball')).toBeInTheDocument();
    expect(screen.getByTestId('mock-pulsating-button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-color-change-square')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sliding-text')).toBeInTheDocument();
    expect(screen.getByTestId('mock-zigzag-box')).toBeInTheDocument();
    expect(screen.getByTestId('mock-wave-effect')).toBeInTheDocument();
    expect(screen.getByTestId('mock-background-animation')).toBeInTheDocument();
  });
});
