import { render, screen } from '@testing-library/react';
import FramerMotionVariants from '../components/FramerMotionVariants';

// Mock all child components
jest.mock('../FadeInComponent', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-fade-in-component">Mock FadeInComponent</div>,
}));
jest.mock('../NavigationMenu', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-navigation-menu">Mock NavigationMenu</div>,
}));
jest.mock('../TooltipWithVariants', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-tooltip-with-variants">Mock TooltipWithVariants</div>,
}));
jest.mock('../ToggleSwitch', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-toggle-switch">Mock ToggleSwitch</div>,
}));
jest.mock('../DynamicList', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-dynamic-list">Mock DynamicList</div>,
}));
jest.mock('../SwipeableGallery', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-swipeable-gallery">Mock SwipeableGallery</div>,
}));


describe('FramerMotionVariants', () => {
  it('renders all child components', () => {
    render(<FramerMotionVariants />);

    expect(screen.getByText('Framer Motion Variants')).toBeInTheDocument();
    expect(screen.getByTestId('mock-fade-in-component')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navigation-menu')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tooltip-with-variants')).toBeInTheDocument();
    expect(screen.getByTestId('mock-toggle-switch')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dynamic-list')).toBeInTheDocument();
    expect(screen.getByTestId('mock-swipeable-gallery')).toBeInTheDocument();
  });
});
