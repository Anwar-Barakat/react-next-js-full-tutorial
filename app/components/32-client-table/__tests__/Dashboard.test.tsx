import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

// Mock child components to isolate Dashboard's rendering
jest.mock('../components/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-sidebar">Mock Sidebar</div>,
}));

jest.mock('../components/Table', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-table">Mock Table</div>,
}));

describe('Dashboard', () => {
  it('renders Sidebar and Table components', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
  });
});
