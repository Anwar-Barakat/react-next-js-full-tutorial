interface FetchedData {
  id: number;
  name: string;
  value: string;
}

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