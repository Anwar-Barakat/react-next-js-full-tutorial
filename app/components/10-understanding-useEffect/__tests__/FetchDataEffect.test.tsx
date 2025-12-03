import { render, screen, waitFor } from '@testing-library/react';
import FetchDataEffect from '../components/FetchDataEffect';

describe('FetchDataEffect', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post Title',
    body: 'Test Post Body',
  };

  beforeEach(() => {
    // Mock the global fetch function
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPost),
      } as Response)
    );
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Clean up the mock after each test
  });

  it('renders loading state initially and then post title after fetching', async () => {
    render(<FetchDataEffect />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(`First post title: ${mockPost.title}`)).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('handles fetch errors', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<FetchDataEffect />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
    });
    expect(screen.queryByText(`First post title: ${mockPost.title}`)).not.toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});
