import { render, screen } from '@testing-library/react';
import { ReactQueryDemo } from '../components/ReactQueryDemo';

// Mock Posts component
jest.mock('../Posts', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-posts">Mock Posts</div>,
}));

describe('ReactQueryDemo', () => {
  it('renders the Posts component', () => {
    render(<ReactQueryDemo />);

    expect(screen.getByTestId('mock-posts')).toBeInTheDocument();
  });
});
