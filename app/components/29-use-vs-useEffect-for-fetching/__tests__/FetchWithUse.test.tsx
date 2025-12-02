import React, { Suspense } from 'react';
import React, { Suspense } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FetchWithUse } from '../components/FetchWithUse';
import { fetchData } from '../dataFetcher';

// Mock the dataFetcher to control its behavior
jest.mock('../dataFetcher', () => ({
  fetchData: jest.fn(),
}));

const mockFetchData = fetchData as jest.Mock;

describe('FetchWithUse', () => {
  // Suppress console.error output for tests that expect React Suspense boundaries to catch errors
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers(); // Re-introduce fake timers
    mockFetchData.mockReset();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.useRealTimers(); // Re-introduce real timers cleanup
  });

  it('displays data when the promise resolves', async () => {
    const mockData = { id: 1, name: 'Test Use Hook', value: 'Resolved value' };
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise<any>((resolve) => {
      resolvePromise = resolve;
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <FetchWithUse promise={pendingPromise} />
      </Suspense>
    );

    // Initial loading state (Suspense fallback)
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    act(() => {
      resolvePromise(mockData); // Resolve the promise
      jest.runAllTimers(); // Advance timers *after* resolving promise
    });
    // Await for React to update after promise resolution
    // Using an additional tick to ensure all microtasks are flushed and React has re-rendered
    await new Promise(process.nextTick);

    await waitFor(() => {
      expect(screen.getByTestId('use-id-display')).toHaveTextContent(`ID: ${mockData.id}`);
      expect(screen.getByTestId('use-name-display')).toHaveTextContent(`Name: ${mockData.name}`);
      expect(screen.getByTestId('use-value-display')).toHaveTextContent(`Value: ${mockData.value}`);
    }, { timeout: 3000 });
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('suspends rendering until the promise resolves', async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise<any>((resolve) => {
      resolvePromise = resolve;
    });
    const mockData = { id: 2, name: 'Suspended Data', value: 'Eventually resolved' };

    render(
      <Suspense fallback={<div>Loading Suspense...</div>}>
        <FetchWithUse promise={pendingPromise} />
      </Suspense>
    );

    expect(screen.getByText('Loading Suspense...')).toBeInTheDocument();

    // Resolve the promise
    act(() => {
      resolvePromise!(mockData); // Resolve the promise
      jest.runAllTimers(); // Advance timers *after* resolving promise
    });
    // Drain microtask queue and allow React to re-render
    await new Promise(process.nextTick);

    await waitFor(() => {
      expect(screen.getByTestId('use-id-display')).toHaveTextContent(`ID: ${mockData.id}`);
      expect(screen.getByTestId('use-name-display')).toHaveTextContent(`Name: ${mockData.name}`);
    }, { timeout: 3000 });
    expect(screen.queryByText('Loading Suspense...')).not.toBeInTheDocument();
  });


});
