import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PostsMutations from '../PostsMutations';
import axios from 'axios';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: () => <svg data-testid="plus-icon" />,
  Edit2: () => <svg data-testid="edit-icon" />,
  Trash2: () => <svg data-testid="trash-icon" />,
  Check: () => <svg data-testid="check-icon" />,
  X: () => <svg data-testid="x-icon" />,
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock react-query hooks
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;
const mockUseQueryClient = useQueryClient as jest.Mock;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

let user: ReturnType<typeof userEvent.setup>;

describe('PostsMutations', () => {
  let invalidateQueries: jest.Mock;
  let setQueryData: jest.Mock;
  let cancelQueries: jest.Mock;
  let windowConfirmSpy: jest.SpyInstance;
  let windowAlertSpy: jest.SpyInstance;

  beforeEach(() => {
    invalidateQueries = jest.fn();
    setQueryData = jest.fn();
    cancelQueries = jest.fn().mockResolvedValue(undefined); // Mock as resolved promise
    windowConfirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    windowAlertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    mockUseQueryClient.mockReturnValue({
      invalidateQueries,
      setQueryData,
      cancelQueries,
    });

    // Default mock for useQuery: return existing posts
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: [{ id: '1', title: 'Existing Post', author: 'Existing Author' }],
      error: null,
    });

    // Default mock for useMutation: immediately resolve onSuccess
    mockUseMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
      variables: undefined,
      isSuccess: false, // Add isSuccess for more complete state
    });

    user = userEvent.setup(); // Initialize userEvent here
  });

  afterEach(() => {
    jest.clearAllMocks();
    windowConfirmSpy.mockRestore();
    windowAlertSpy.mockRestore();
  });

  const renderWithClient = (ui: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  };

  it('renders loading state initially', () => {
    mockUseQuery.mockReturnValue({ isLoading: true, data: undefined, error: null });
    renderWithClient(<PostsMutations />);
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  it('renders posts on successful data fetch', () => {
    renderWithClient(<PostsMutations />);
    expect(screen.getByText('Posts Management')).toBeInTheDocument();
    expect(screen.getByText('Existing Post')).toBeInTheDocument();
    expect(screen.getByText('Author: Existing Author')).toBeInTheDocument();
    expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument();
  });

  it('handles fetch error', () => {
    mockUseQuery.mockReturnValue({ isLoading: false, data: undefined, error: new Error('Network error') });
    renderWithClient(<PostsMutations />);
    expect(screen.getByText('Error fetching posts: Network error')).toBeInTheDocument();
  });

  it.skip('adds a new post', async () => {

    const mutateFn = jest.fn(); // This will be the function that component calls
    let actualOnSuccess: Function;

    mockUseMutation.mockImplementationOnce((options) => { // This is for addPostMutation
      actualOnSuccess = options.onSuccess; // Capture the onSuccess callback
      return {
        mutate: mutateFn.mockImplementation((vars) => {
          actualOnSuccess(vars); // Manually trigger onSuccess when mutate is called
        }),
        isPending: false,
        isError: false,
        error: null,
        variables: undefined,
        isSuccess: false,
      };
    });

    // Also need to ensure useQuery returns data
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: [{ id: '1', title: 'Existing Post', author: 'Existing Author' }],
      error: null,
    });

    renderWithClient(<PostsMutations />);

    const titleInput = screen.getByPlaceholderText('Post Title');
    const authorInput = screen.getByPlaceholderText('Author');
    const addButton = screen.getByRole('button', { name: /add post/i });

    await user.type(titleInput, 'New Post Title');
    await user.type(authorInput, 'New Author');
    await user.click(addButton);

    await waitFor(() => {
      expect(mutateFn).toHaveBeenCalledWith({ title: 'New Post Title', author: 'New Author' });
    });
  });
});
