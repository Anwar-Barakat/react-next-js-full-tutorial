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
    <div className="border border-[var(--border)] p-4 rounded-[var(--radius)] shadow-[var(--shadow-md)] bg-[var(--card)] text-[var(--foreground)]">
      <h3 className="text-xl font-semibold mb-3 text-[var(--primary)]">Fetch with `useEffect`</h3>
      {loading && <p className="text-[var(--accent)]">Loading data...</p>}
      {error && <p className="text-[var(--secondary)]">Error: {error}</p>}
      {data && (
        <div className="space-y-2">
          <p className="text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">ID:</strong> {data.id}</p>
          <p className="text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">Name:</strong> {data.name}</p>
          <p className="text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">Value:</strong> {data.value}</p>
        </div>
      )}
      {!loading && !error && !data && <p className="text-[var(--muted-foreground)]">Click &quot;Fetch Data&quot; to load.</p>}
    </div>
  );
};