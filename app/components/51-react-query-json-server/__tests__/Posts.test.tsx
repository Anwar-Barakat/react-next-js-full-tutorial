import { render, screen, waitFor } from '@testing-library/react';
import Posts from '../Posts';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

// Mock @tanstack/react-query's useQuery hook
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'), // Use actual for other exports
  useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for tests
    },
  },
});

describe('Posts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockUseQuery.mockReturnValue({ isLoading: true, data: undefined, error: null });
    render(
      <QueryClientProvider client={queryClient}>
        <Posts />
      </QueryClientProvider>
    );
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  it('renders posts on successful data fetch', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', author: 'Author A' },
      { id: '2', title: 'Post 2', author: 'Author B' },
    ];
    mockUseQuery.mockReturnValue({ isLoading: false, data: mockPosts, error: null });

    render(
      <QueryClientProvider client={queryClient}>
        <Posts />
      </QueryClientProvider>
    );

    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Author: Author A')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
    expect(screen.getByText('Author: Author B')).toBeInTheDocument();
    expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument();
  });

  it('renders error message on fetch failure', async () => {
    const mockError = new Error('Failed to fetch posts');
    mockUseQuery.mockReturnValue({ isLoading: false, data: undefined, error: mockError });
    render(
      <QueryClientProvider client={queryClient}>
        <Posts />
      </QueryClientProvider>
    );

    expect(screen.getByText(`Error: ${mockError.message}`)).toBeInTheDocument();
    expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument();
    expect(screen.queryByText('Posts')).not.toBeInTheDocument(); // Title should not be there if error
  });
});
