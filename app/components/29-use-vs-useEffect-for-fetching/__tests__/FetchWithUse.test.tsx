import React, { Suspense } from 'react';
import { render, screen, waitFor, act, waitForElementToBeRemoved } from '@testing-library/react';
import { FetchWithUse } from '../components/FetchWithUse';

describe('FetchWithUse', () => {
  // Suppress console.error output for tests that expect React Suspense boundaries to catch errors
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it.skip('suspends rendering until the promise resolves, then displays the data', async () => {
    const mockData = { id: 1, name: 'Test Use Hook', value: 'Resolved value' };
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise<any>((resolve) => {
      resolvePromise = resolve;
    });

    const { getByText, findByTestId } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <FetchWithUse promise={pendingPromise} />
      </Suspense>
    );

    // Assert initial loading state
    expect(getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      resolvePromise(mockData); // Resolve the promise
    });

    // Wait for the loading fallback to be removed
    await waitForElementToBeRemoved(() => getByText('Loading...'));

    // Now assert the displayed data
    expect(await findByTestId('use-id-display')).toHaveTextContent(`ID: ${mockData.id}`);
    expect(await findByTestId('use-name-display')).toHaveTextContent(`Name: ${mockData.name}`);
    expect(await findByTestId('use-value-display')).toHaveTextContent(`Value: ${mockData.value}`);
  });
});
