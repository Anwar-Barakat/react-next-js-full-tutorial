"use client";

import React, { useState, Suspense } from 'react';
import { fetchData } from './dataFetcher';
import { FetchWithUseEffect } from './FetchWithUseEffect';
import { FetchWithUse } from './FetchWithUse';
import { ErrorBoundary } from './ErrorBoundary';

export const DataFetchingDemo: React.FC = () => {
  const [triggerErrorUseEffect, setTriggerErrorUseEffect] = useState<boolean>(false);
  const [triggerErrorUse, setTriggerErrorUse] = useState<boolean>(false);
  const [fetchKey, setFetchKey] = useState<number>(0);


  const useHookPromise = React.useMemo(() => {
    return fetchData(triggerErrorUse, 2000);
  }, [triggerErrorUse]);

  const handleRefetch = () => {
    setFetchKey(prev => prev + 1);
    setTriggerErrorUse(false);
  };

  const handleRefetchWithError = () => {
    setFetchKey(prev => prev + 1);
    setTriggerErrorUse(true);
  };

  return (
    <div className="center-content py-12 px-4 min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl md:text-4xl font-bold center-text mb-4 text-[var(--foreground)]">
          `use` Hook vs. `useEffect` for Data Fetching
        </h2>
        <p className="mb-8 center-text text-lg text-[var(--muted-foreground)]">
          This demo compares traditional data fetching with `useEffect` against the new `use` hook with Suspense and Error Boundaries.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
          <div className="flex-1 border border-[var(--border)] p-6 rounded-[var(--radius)] shadow-[var(--shadow-lg)] bg-[var(--card)]">
            <FetchWithUseEffect triggerError={triggerErrorUseEffect} />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setTriggerErrorUseEffect(false);
                }}
                className="btn btn-primary btn-sm"
              >
                Fetch Data (useEffect)
              </button>
              <button
                onClick={() => {
                  setTriggerErrorUseEffect(true);
                }}
                className="btn btn-secondary btn-sm"
              >
                Fetch Error (useEffect)
              </button>
            </div>
          </div>

          <div className="flex-1 border border-[var(--border)] p-6 rounded-[var(--radius)] shadow-[var(--shadow-lg)] bg-[var(--card)]">
            <ErrorBoundary fallback={
              <div className="text-[var(--secondary)] p-4 border border-[var(--secondary)] rounded-[var(--radius)] bg-[var(--secondary)]/10">
                <h3 className="text-xl font-semibold mb-2">Error with `use` Hook</h3>
                <p>Failed to load data. Please try again.</p>
                <button
                  onClick={handleRefetch}
                  className="mt-3 btn btn-accent btn-sm"
                >
                  Retry Fetch
                </button>
              </div>
            }>
              <Suspense fallback={
                <div className="text-[var(--accent)] p-4 border border-[var(--accent)] rounded-[var(--radius)] bg-[var(--accent)]/10">
                  <h3 className="text-xl font-semibold mb-2">Loading with `use` Hook...</h3>
                  <p>Data is being fetched using React 19&apos;s `use` hook and Suspense.</p>
                </div>
              }>
                <FetchWithUse promise={useHookPromise} />
              </Suspense>
            </ErrorBoundary>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleRefetch}
                className="btn btn-accent btn-sm"
              >
                Fetch Data (use Hook)
              </button>
              <button
                onClick={handleRefetchWithError}
                className="btn btn-secondary btn-sm"
              >
                Fetch Error (use Hook)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};