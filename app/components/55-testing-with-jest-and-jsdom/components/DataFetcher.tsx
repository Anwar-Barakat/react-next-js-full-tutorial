import React, { useState, useEffect } from 'react';

interface DataFetcherProps {
  shouldFetchSuccessfully: boolean;
}

export const DataFetcher: React.FC<DataFetcherProps> = ({ shouldFetchSuccessfully }) => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);

    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

        if (shouldFetchSuccessfully) {
          setData('Fetched data successfully!');
        } else {
          throw new Error('Failed to fetch data.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shouldFetchSuccessfully]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return <div>Data: {data}</div>;
};
