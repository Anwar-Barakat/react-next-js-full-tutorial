import { render, screen } from '@testing-library/react';
import App from '../components/App';

// Mock child components to isolate App's rendering
jest.mock('../components/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-sidebar">Mock Sidebar</div>,
}));

jest.mock('../components/Profile', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-profile">Mock Profile</div>,
}));

describe('App', () => {
  it('renders Sidebar and Profile components', () => {
    render(<App />);
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-profile')).toBeInTheDocument();
  });
});
