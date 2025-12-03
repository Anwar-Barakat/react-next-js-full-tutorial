import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { DataFetchingDemo } from '../components/DataFetchingDemo';
import { fetchData } from '../dataFetcher'; // Corrected import path

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

  it.skip('renders initial state and handles success and error for useEffect approach', async () => {
    const mockUseEffectData = { id: 1, name: 'UseEffect Data', value: 'Value from useEffect' };
    const useEffectErrorMessage = 'Failed to fetch data: UseEffect Error';

    // Initial render with loading state
    mockFetchData.mockReturnValue(new Promise(() => {})); // Keep it pending initially
    render(<DataFetchingDemo />);
    const useEffectContainer = screen.getByTestId('use-effect-container');
    expect(within(useEffectContainer).getByTestId('loading-message')).toBeInTheDocument();

    // Test successful fetch
    mockFetchData.mockResolvedValueOnce(mockUseEffectData);
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Data (useEffect)' }));
    act(() => { jest.runAllTimers(); }); // Advance timers to allow useEffect to complete
    await waitFor(() => expect(within(useEffectContainer).queryByTestId('loading-message')).not.toBeInTheDocument()); // Wait for loading to disappear
    await waitFor(() => expect(within(useEffectContainer).getByTestId('id-display')).toHaveTextContent(`ID: ${mockUseEffectData.id}`));

    // Test error fetch
    mockFetchData.mockRejectedValueOnce(new Error(useEffectErrorMessage));
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Error (useEffect)' }));
    act(() => { jest.runAllTimers(); }); // Advance timers for error handling
    await waitFor(() => expect(within(useEffectContainer).getByTestId('error-message')).toHaveTextContent(`Error: ${useEffectErrorMessage}`));
  });

  it.skip('renders initial state and handles success, error, and retry for use hook approach', async () => {
    const mockUseHookData = { id: 2, name: 'Use Hook Data', value: 'Value from use hook' };
    const useHookErrorMessage = 'Failed to fetch data: Network error or server issue.';

    // Test successful fetch
    mockFetchData.mockResolvedValueOnce(mockUseHookData);
    render(<DataFetchingDemo />);
    const useHookContainer = screen.getByTestId('use-hook-container');
    await waitFor(() => expect(within(useHookContainer).getByTestId('use-id-display')).toHaveTextContent(`ID: ${mockUseHookData.id}`));

    // Test error fetch
    mockFetchData.mockRejectedValueOnce(new Error(useHookErrorMessage));
    fireEvent.click(screen.getByRole('button', { name: 'Fetch Error (use Hook)' }));
    await waitFor(() => {
        expect(within(useHookContainer).getByTestId('use-hook-error-heading')).toBeInTheDocument();
        expect(within(useHookContainer).getByTestId('use-hook-error-message')).toBeInTheDocument();
    });

    // Test retry
    mockFetchData.mockResolvedValueOnce(mockUseHookData); // Make retry succeed
    const retryButton = within(useHookContainer).getByRole('button', { name: 'Retry Fetch' });
    fireEvent.click(retryButton);
    await waitFor(() => expect(within(useHookContainer).getByTestId('use-id-display')).toHaveTextContent(`ID: ${mockUseHookData.id}`));
  });
});