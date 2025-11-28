"use client";

import React from 'react';


interface FetchedData {
  id: number;
  name: string;
  value: string;
}

interface FetchWithUseProps {
  promise: Promise<FetchedData>;
}

export const FetchWithUse: React.FC<FetchWithUseProps> = ({ promise }) => {
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