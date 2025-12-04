import { render, screen } from '@testing-library/react';
import { ReduxToolkitDemo } from '../components/ReduxToolkitDemo';

// Mock react-redux Provider
jest.mock('react-redux', () => ({
  __esModule: true,
  Provider: ({ children }: any) => <div data-testid="mock-redux-provider">{children}</div>,
}));

// Mock Counter component
jest.mock('../Counter', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-counter">Mock Counter</div>,
}));


describe('ReduxToolkitDemo', () => {
  it('renders the Counter component within the Redux Provider', () => {
    render(<ReduxToolkitDemo />);

    expect(screen.getByTestId('mock-redux-provider')).toBeInTheDocument();
    expect(screen.getByTestId('mock-counter')).toBeInTheDocument();
  });
});
