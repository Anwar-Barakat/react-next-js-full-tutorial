import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { FetchWithUseEffect } from '../components/FetchWithUseEffect';
import { fetchData } from '../dataFetcher';

// Mock the dataFetcher to control its behavior
jest.mock('../dataFetcher', () => ({
  fetchData: jest.fn(),
}));

const mockFetchData = fetchData as jest.Mock;

describe('FetchWithUseEffect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockFetchData.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('displays loading state initially and then renders data on success', async () => {
    const mockData = { id: 1, name: 'Test UseEffect', value: 'Fetched value' };
    mockFetchData.mockResolvedValueOnce(mockData);

    render(<FetchWithUseEffect triggerError={false} />);

    expect(screen.getByTestId('loading-message')).toBeInTheDocument(); // Assert loading immediately

    act(() => {
      jest.runAllTimers(); // Advance all timers to resolve the fetch
    });

    await waitFor(() => {
      expect(screen.getByTestId('id-display')).toHaveTextContent(`ID: ${mockData.id}`);
      expect(screen.getByTestId('name-display')).toHaveTextContent(`Name: ${mockData.name}`);
      expect(screen.getByTestId('value-display')).toHaveTextContent(`Value: ${mockData.value}`);
    });

    expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
    expect(mockFetchData).toHaveBeenCalledWith(false, 2000);
  });

  it('displays error message on fetch failure', async () => {
    const errorMessage = 'Failed to fetch data: Test Error';
    mockFetchData.mockRejectedValueOnce(new Error(errorMessage));

    render(<FetchWithUseEffect triggerError={true} />);

    expect(screen.getByTestId('loading-message')).toBeInTheDocument();

    act(() => {
      jest.runAllTimers(); // Advance all timers to resolve the fetch
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(`Error: ${errorMessage}`);
    });

    expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
    expect(screen.queryByTestId('id-display')).not.toBeInTheDocument();
    expect(mockFetchData).toHaveBeenCalledWith(true, 2000);
  });

  it('displays initial message when no data is fetched yet and not loading/error', async () => {
    mockFetchData.mockResolvedValueOnce(null); // Resolve with null to trigger initial message

    render(<FetchWithUseEffect triggerError={false} />);

    act(() => {
      jest.runAllTimers(); // Advance all timers to resolve the fetch
    });

    // Wait for the loading state to disappear, and initial message to appear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
      expect(screen.getByTestId('initial-message')).toBeInTheDocument();
    });
  });
});
