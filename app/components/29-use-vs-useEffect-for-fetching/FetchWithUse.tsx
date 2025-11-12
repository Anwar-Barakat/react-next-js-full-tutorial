"use client";

import React from 'react';
import { fetchData } from './dataFetcher';

interface FetchWithUseProps {
  promise: Promise<any>; // The promise to be consumed by React.use
}

export const FetchWithUse: React.FC<FetchWithUseProps> = ({ promise }) => {
  // React.use will suspend the component if the promise is not resolved yet.
  // If the promise rejects, it will be caught by the nearest Error Boundary.
  const data = React.use(promise);

  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50">
      <h3 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-400">Fetch with `use` Hook (React 19)</h3>
      <div>
        <p><strong>ID:</strong> {data.id}</p>
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Value:</strong> {data.value}</p>
      </div>
    </div>
  );
};
