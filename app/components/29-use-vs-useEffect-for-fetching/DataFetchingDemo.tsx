"use client";

import React, { useState, Suspense } from 'react';
import { fetchData } from './dataFetcher';
import { FetchWithUseEffect } from './FetchWithUseEffect';
import { FetchWithUse } from './FetchWithUse';
import { ErrorBoundary } from './ErrorBoundary';

export const DataFetchingDemo: React.FC = () => {
  const [triggerErrorUseEffect, setTriggerErrorUseEffect] = useState<boolean>(false);
  const [triggerErrorUse, setTriggerErrorUse] = useState<boolean>(false);
  const [fetchKey, setFetchKey] = useState<number>(0); // Used to re-trigger fetch for 'use' hook

  // Memoize the promise for the 'use' hook to prevent re-fetching on every render
  // unless explicitly triggered by fetchKey or triggerErrorUse
  const useHookPromise = React.useMemo(() => {
    return fetchData(triggerErrorUse, 2000);
  }, [fetchKey, triggerErrorUse]);

  const handleRefetch = () => {
    setFetchKey(prev => prev + 1);
    setTriggerErrorUse(false);
  };

  const handleRefetchWithError = () => {
    setFetchKey(prev => prev + 1);
    setTriggerErrorUse(true);
  };

  return (
    <div className="font-sans p-5 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-50">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
        `use` Hook vs. `useEffect` for Data Fetching
      </h2>
      <p className="mb-6 text-center text-lg text-gray-700 dark:text-gray-300">
        This demo compares traditional data fetching with `useEffect` against the new `use` hook with Suspense and Error Boundaries.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-4xl mx-auto">
        {/* useEffect Example */}
        <div className="flex-1 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
          <FetchWithUseEffect triggerError={triggerErrorUseEffect} />
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setTriggerErrorUseEffect(false);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Fetch Data (useEffect)
            </button>
            <button
              onClick={() => {
                setTriggerErrorUseEffect(true);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Fetch Error (useEffect)
            </button>
          </div>
        </div>

        {/* use Hook Example */}
        <div className="flex-1 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
          <ErrorBoundary fallback={
            <div className="text-red-600 dark:text-red-400 p-4 border border-red-300 rounded-md bg-red-50 dark:bg-red-900">
              <h3 className="text-xl font-semibold mb-2">Error with `use` Hook</h3>
              <p>Failed to load data. Please try again.</p>
              <button
                onClick={handleRefetch}
                className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              >
                Retry Fetch
              </button>
            </div>
          }>
            <Suspense fallback={
              <div className="text-yellow-600 dark:text-yellow-400 p-4 border border-yellow-300 rounded-md bg-yellow-50 dark:bg-yellow-900">
                <h3 className="text-xl font-semibold mb-2">Loading with `use` Hook...</h3>
                <p>Data is being fetched using React 19's `use` hook and Suspense.</p>
              </div>
            }>
              <FetchWithUse promise={useHookPromise} />
            </Suspense>
          </ErrorBoundary>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleRefetch}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Fetch Data (use Hook)
            </button>
            <button
              onClick={handleRefetchWithError}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Fetch Error (use Hook)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};