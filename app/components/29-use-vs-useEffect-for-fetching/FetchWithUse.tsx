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
    <div className="glass glass-lg w-full text-center">
      <h3 className="text-xl font-semibold mb-3 text-accent">Fetch with `use` Hook (React 19)</h3>
      <div className="space-y-2">
        <p className="text-foreground text-left"><strong className="text-primary">ID:</strong> {data.id}</p>
        <p className="text-foreground text-left"><strong className="text-primary">Name:</strong> {data.name}</p>
        <p className="text-foreground text-left"><strong className="text-primary">Value:</strong> {data.value}</p>
      </div>
    </div>
  );
};