import { render, screen, act } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

// A component that always throws an error
const ThrowingComponent = () => {
  throw new Error('Test error from ThrowingComponent');
};

describe('ErrorBoundary', () => {
  // Suppress console.error output because we expect an error to be caught
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children if no error occurs', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback UI</div>}>
        <div>Children Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Children Content')).toBeInTheDocument();
    expect(screen.queryByText('Fallback UI')).not.toBeInTheDocument();
  });

  it('renders fallback UI when a child component throws an error', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback UI</div>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Fallback UI')).toBeInTheDocument();
    expect(screen.queryByText('Children Content')).not.toBeInTheDocument();
  });

  it('calls componentDidCatch when an error occurs', () => {
    const mockComponentDidCatch = jest.spyOn(ErrorBoundary.prototype, 'componentDidCatch');

    render(
      <ErrorBoundary fallback={<div>Fallback UI</div>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(mockComponentDidCatch).toHaveBeenCalledTimes(1);
    expect(mockComponentDidCatch).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );

    mockComponentDidCatch.mockRestore();
  });
});
