import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FetchDataComponent from '../components/FetchDataComponent';
import useFetch from '../components/useFetch';

// Mock the useFetch hook
jest.mock('../components/useFetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseFetch = useFetch as jest.Mock;

describe('FetchDataComponent', () => {
  const mockTodos = [
    { userId: 1, id: 1, title: 'Todo 1', completed: false },
    { userId: 1, id: 2, title: 'Todo 2', completed: true },
  ];

  it('renders loading state', () => {
    mockUseFetch.mockReturnValue({ data: null, loading: true, error: null });
    render(<FetchDataComponent />);
    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
  });

  it('renders data when fetch is successful', async () => {
    mockUseFetch.mockReturnValue({ data: mockTodos, loading: false, error: null });
    render(<FetchDataComponent />);
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
    expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    const mockError = new Error('Failed to fetch todos');
    mockUseFetch.mockReturnValue({ data: null, loading: false, error: mockError });
    render(<FetchDataComponent />);
    expect(screen.getByText(`Error: ${mockError.message}`)).toBeInTheDocument();
    expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
  });

  it('renders nothing if data is null and not loading and no error', () => {
    mockUseFetch.mockReturnValue({ data: null, loading: false, error: null });
    const { container } = render(<FetchDataComponent />);
    expect(screen.queryByText('Todos')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading todos...')).not.toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
