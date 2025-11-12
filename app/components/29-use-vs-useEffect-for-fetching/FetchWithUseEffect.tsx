"use client";

import React, { useState, useEffect } from 'react';
import { fetchData } from './dataFetcher';

interface FetchedData {
  id: number;
  name: string;
  value: string;
}

interface FetchWithUseEffectProps {
  triggerError: boolean;
}

export const FetchWithUseEffect: React.FC<FetchWithUseEffectProps> = ({ triggerError }) => {
  const [data, setData] = useState<FetchedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component

    const getData = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const result = await fetchData(triggerError, 2000);
        if (isMounted) {
          setData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getData();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [triggerError]); // Re-run effect if triggerError changes

  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50">
      <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Fetch with `useEffect`</h3>
      {loading && <p className="text-yellow-600 dark:text-yellow-400">Loading data...</p>}
      {error && <p className="text-red-600 dark:text-red-400">Error: {error}</p>}
      {data && (
        <div>
          <p><strong>ID:</strong> {data.id}</p>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Value:</strong> {data.value}</p>
        </div>
      )}
      {!loading && !error && !data && <p className="text-gray-500 dark:text-gray-400">Click "Fetch Data" to load.</p>}
    </div>
  );
};
