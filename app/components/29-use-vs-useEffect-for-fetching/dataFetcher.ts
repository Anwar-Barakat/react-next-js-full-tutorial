// dataFetcher.ts
// This utility simulates an asynchronous data fetching operation.

interface FetchedData {
  id: number;
  name: string;
  value: string;
}

/**
 * Simulates fetching data from an API.
 * @param shouldError - If true, the promise will reject, simulating an API error.
 * @param delay - The delay in milliseconds before the promise resolves or rejects.
 * @returns A Promise that resolves with FetchedData or rejects with an Error.
 */
export function fetchData(shouldError: boolean = false, delay: number = 1500): Promise<FetchedData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldError) {
        reject(new Error('Failed to fetch data: Network error or server issue.'));
      } else {
        resolve({
          id: Math.floor(Math.random() * 1000),
          name: 'Sample Data',
          value: `Fetched at ${new Date().toLocaleTimeString()}`,
        });
      }
    }, delay);
  });
}
