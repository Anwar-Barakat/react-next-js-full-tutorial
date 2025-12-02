import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataFetchingDemo } from '../components/DataFetchingDemo';
import { fetchData } from '../dataFetcher'; // Import the actual dataFetcher
import { ErrorBoundary } from '../ErrorBoundary'; // Import for proper mocking context

// Mock the dataFetcher globally for this test file
jest.mock('../dataFetcher', () => ({
  fetchData: jest.fn(),
}));

const mockFetchData = fetchData as jest.Mock;

describe('DataFetchingDemo', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockFetchData.mockReset();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.useRealTimers();
  });

  it('renders initial state for both useEffect and use hook sections', async () => {
    // Mock fetchData to immediately resolve to prevent Suspense fallback from showing too quickly
    mockFetchData.mockResolvedValue({ id: 999, name: 'Initial', value: 'Data' });

    render(<DataFetchingDemo />);

    expect(screen.getByTestId('main-heading')).toBeInTheDocument();
    expect(screen.getByText('Fetch with `useEffect`')).toBeInTheDocument();
    await waitFor(async () => {
      expect(await screen.findByTestId('use-hook-loading-message')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // Test FetchWithUseEffect Section
  it('FetchWithUseEffect: fetches and displays data correctly', async () => {
    const mockUseEffectData = { id: 1, name: 'UseEffect Data', value: 'Value from useEffect' };
    mockFetchData.mockResolvedValueOnce(mockUseEffectData); // For initial render
    mockFetchData.mockResolvedValueOnce(mockUseEffectData); // For subsequent manual fetch

    render(<DataFetchingDemo />);
    act(() => {
      jest.runAllTimers(); // Advance all timers for initial effects and network delay
    });
    await Promise.resolve(); // Drain microtask queue for promise resolutions
    const useEffectContainer = screen.getByText('Fetch with `useEffect`').closest('.glass')!;

    expect(within(useEffectContainer).getByTestId('id-display')).toHaveTextContent(`ID: ${mockUseEffectData.id}`);
    expect(within(useEffectContainer).getByTestId('name-display')).toHaveTextContent(`Name: ${mockUseEffectData.name}`);
    expect(within(useEffectContainer).getByTestId('value-display')).toHaveTextContent(`Value: ${mockUseEffectData.value}`);

    // Click fetch button again
    const fetchUseEffectButton = screen.getByRole('button', { name: 'Fetch Data (useEffect)' });
    fireEvent.click(fetchUseEffectButton);

    act(() => {
      jest.runAllTimers(); // Advance all timers for the manual fetch and network delay
    });
    await Promise.resolve(); // Drain microtask queue for promise resolutions

    expect(within(useEffectContainer).getByTestId('id-display')).toHaveTextContent(`ID: ${mockUseEffectData.id}`);
    expect(within(useEffectContainer).getByTestId('name-display')).toHaveTextContent(`Name: ${mockUseEffectData.name}`);
    expect(within(useEffectContainer).getByTestId('value-display')).toHaveTextContent(`Value: ${mockUseEffectData.value}`);

    expect(mockFetchData).toHaveBeenCalledTimes(2); // Initial fetch + manual fetch
  });

  it('FetchWithUseEffect: handles and displays errors correctly', async () => {
    const useEffectErrorMessage = 'Failed to fetch data: UseEffect Error';
    mockFetchData.mockRejectedValueOnce(new Error(useEffectErrorMessage)); // For initial render
    mockFetchData.mockRejectedValueOnce(new Error(useEffectErrorMessage)); // For subsequent manual error trigger

    render(<DataFetchingDemo />);
    act(() => {
      jest.runAllTimers(); // Advance all timers
    });
    await Promise.resolve(); // Drain microtask queue for promise resolutions
    const useEffectContainer = screen.getByText('Fetch with `useEffect`').closest('.glass')!;

    expect(within(useEffectContainer).getByTestId('error-message')).toHaveTextContent(`Error: ${useEffectErrorMessage}`);

    // Click fetch error button again
    const fetchUseEffectErrorButton = screen.getByRole('button', { name: 'Fetch Error (useEffect)' });
    fireEvent.click(fetchUseEffectErrorButton);

    act(() => {
      jest.runAllTimers(); // Advance all timers
    });
    await Promise.resolve(); // Drain microtask queue for promise resolutions

    expect(within(useEffectContainer).getByTestId('error-message')).toHaveTextContent(`Error: ${useEffectErrorMessage}`);

    expect(mockFetchData).toHaveBeenCalledTimes(2); // Initial fetch + manual error trigger
  });

  // Test FetchWithUse Section
  it('FetchWithUse: fetches and displays data correctly', async () => {
    const mockUseHookData = { id: 2, name: 'Use Hook Data', value: 'Value from use hook' };
    mockFetchData.mockResolvedValueOnce(mockUseHookData); // For initial render
    mockFetchData.mockResolvedValueOnce(mockUseHookData); // For subsequent manual fetch

    render(<DataFetchingDemo />);
    act(() => {
      jest.runAllTimers(); // Advance all timers
    });
    await Promise.resolve(); // Drain microtask queue for promise resolutions
    const useHookContainer = screen.getByRole('button', { name: 'Fetch Data (use Hook)' }).closest('.glass')!;

    expect(within(useHookContainer).getByTestId('use-id-display')).toHaveTextContent(`ID: ${mockUseHookData.id}`);
    expect(within(useHookContainer).getByTestId('use-name-display')).toHaveTextContent(`Name: ${mockUseHookData.name}`);
    expect(within(useHookContainer).getByTestId('use-value-display')).toHaveTextContent(`Value: ${mockUseHookData.value}`);

    // Click fetch button again
    const fetchUseHookButton = screen.getByRole('button', { name: 'Fetch Data (use Hook)' });
    fireEvent.click(fetchUseHookButton);

    act(() => {
      jest.runAllTimers(); // Advance all timers
    });
    await Promise.resolve(); // Drain microtask queue for promise resolutions

    expect(within(useHookContainer).getByTestId('use-id-display')).toHaveTextContent(`ID: ${mockUseHookData.id}`);
    expect(within(useHookContainer).getByTestId('use-name-display')).toHaveTextContent(`Name: ${mockUseHookData.name}`);
    expect(within(useHookContainer).getByTestId('use-value-display')).toHaveTextContent(`Value: ${mockUseHookData.value}`);

    expect(mockFetchData).toHaveBeenCalledTimes(2); // Initial fetch + manual fetch
  });

  it('FetchWithUse: handles and displays errors correctly', async () => {
    const useHookErrorMessage = 'Failed to fetch data: Network error or server issue.';
    mockFetchData.mockRejectedValueOnce(new Error(useHookErrorMessage)); // For initial render
    mockFetchData.mockRejectedValueOnce(new Error(useHookErrorMessage)); // For subsequent manual error trigger

    render(<DataFetchingDemo />);
    act(() => {
      jest.runAllTimers(); // Advance all timers
    });
    await Promise.resolve(); // Drain microtask queue for promise resolutions
    const useHookContainer = screen.getByRole('button', { name: 'Fetch Data (use Hook)' }).closest('.glass')!;

    // Error displayed for use hook (ErrorBoundary fallback)
    expect(within(useHookContainer).getByTestId('use-hook-error-heading')).toBeInTheDocument();
    expect(within(useHookContainer).getByTestId('use-hook-error-message')).toBeInTheDocument();

    // Click retry button
    const retryButton = screen.getByRole('button', { name: 'Retry Fetch' });
    fireEvent.click(retryButton);

    act(() => {
      jest.runAllTimers(); // Advance all timers
    });
    await Promise.resolve(); // Drain microtask queue for promise resolutions

    // And then error again
    expect(within(useHookContainer).getByTestId('use-hook-error-heading')).toBeInTheDocument();
    expect(within(useHookContainer).getByTestId('use-hook-error-message')).toBeInTheDocument();

    expect(mockFetchData).toHaveBeenCalledTimes(2); // Initial error fetch + retry error fetch
  });
});