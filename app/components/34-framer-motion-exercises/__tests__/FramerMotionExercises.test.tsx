import { render, screen } from '@testing-library/react';
import FramerMotionExercises from '../components/FramerMotionExercises';

// Mock all child components
jest.mock('../components/BasicTranslation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-basic-translation">Mock BasicTranslation</div>,
}));
jest.mock('../components/VerticalMovement', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-vertical-movement">Mock VerticalMovement</div>,
}));
jest.mock('../components/RotationAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-rotation-animation">Mock RotationAnimation</div>,
}));
jest.mock('../components/SkewedTransition', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-skewed-transition">Mock SkewedTransition</div>,
}));
jest.mock('../components/FadeComponent', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-fade-component">Mock FadeComponent</div>,
}));
jest.mock('../components/SlideInSidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-slide-in-sidebar">Mock SlideInSidebar</div>,
}));
jest.mock('../components/ModalWithTransition', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-modal-with-transition">Mock ModalWithTransition</div>,
}));
jest.mock('../components/ResponsiveButton', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-responsive-button">Mock ResponsiveButton</div>,
}));
jest.mock('../components/NotificationToast', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-notification-toast">Mock NotificationToast</div>,
}));


describe('FramerMotionExercises', () => {
  it('renders all child components', () => {
    render(<FramerMotionExercises />);

    expect(screen.getByText('Framer Motion Exercises')).toBeInTheDocument();
    expect(screen.getByTestId('mock-basic-translation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-vertical-movement')).toBeInTheDocument();
    expect(screen.getByTestId('mock-rotation-animation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-skewed-transition')).toBeInTheDocument();
    expect(screen.getByTestId('mock-fade-component')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slide-in-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-modal-with-transition')).toBeInTheDocument();
    expect(screen.getByTestId('mock-responsive-button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-notification-toast')).toBeInTheDocument();
  });
});
