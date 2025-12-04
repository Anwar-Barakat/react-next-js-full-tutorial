import { render, screen } from '@testing-library/react';
import { ReactQueryMutationsDemo } from '../components/ReactQueryMutationsDemo';

// Mock PostsMutations component
jest.mock('../PostsMutations', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-posts-mutations">Mock PostsMutations</div>,
}));

describe('ReactQueryMutationsDemo', () => {
  it('renders the PostsMutations component', () => {
    render(<ReactQueryMutationsDemo />);

    expect(screen.getByTestId('mock-posts-mutations')).toBeInTheDocument();
  });
});
