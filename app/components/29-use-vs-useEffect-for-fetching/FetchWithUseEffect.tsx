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
    let isMounted = true;

    const getData = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const result = await fetchData(triggerError, 2000);
        if (isMounted) {
          setData(result);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError((err as Error).message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getData();

    return () => {
      isMounted = false;
    };
  }, [triggerError]);

  return (
    <div className="glass glass-lg w-full text-center">
      <h3 className="text-xl font-semibold mb-3 text-primary">Fetch with `useEffect`</h3>
      {loading && <p className="text-accent">Loading data...</p>}
      {error && <p className="text-secondary">Error: {error}</p>}
      {data && (
        <div className="space-y-2">
          <p className="text-foreground text-left"><strong className="text-primary">ID:</strong> {data.id}</p>
          <p className="text-foreground text-left"><strong className="text-primary">Name:</strong> {data.name}</p>
          <p className="text-foreground text-left"><strong className="text-primary">Value:</strong> {data.value}</p>
        </div>
      )}
      {!loading && !error && !data && <p className="text-muted-foreground">Click &quot;Fetch Data&quot; to load.</p>}
    </div>
  );
};