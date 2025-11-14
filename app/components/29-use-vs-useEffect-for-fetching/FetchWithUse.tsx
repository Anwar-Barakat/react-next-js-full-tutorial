"use client";

import React from 'react';
import { fetchData } from './dataFetcher';

interface FetchedData {
  id: number;
  name: string;
  value: string;
}

interface FetchWithUseProps {
  promise: Promise<FetchedData>; // The promise to be consumed by React.use
}

export const FetchWithUse: React.FC<FetchWithUseProps> = ({ promise }) => {
  // React.use will suspend the component if the promise is not resolved yet.
  // If the promise rejects, it will be caught by the nearest Error Boundary.
  const data = React.use(promise);

  return (
    <div className="border border-[var(--border)] p-4 rounded-[var(--radius)] shadow-[var(--shadow-md)] bg-[var(--card)] text-[var(--foreground)]">
      <h3 className="text-xl font-semibold mb-3 text-[var(--accent)]">Fetch with `use` Hook (React 19)</h3>
      <div className="space-y-2">
        <p className="text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">ID:</strong> {data.id}</p>
        <p className="text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">Name:</strong> {data.name}</p>
        <p className="text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">Value:</strong> {data.value}</p>
      </div>
    </div>
  );
};
