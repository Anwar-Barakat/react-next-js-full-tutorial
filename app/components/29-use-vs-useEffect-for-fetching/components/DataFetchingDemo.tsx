"use client";

import React, { useState, Suspense } from 'react';
import { fetchData } from '../dataFetcher';
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
    <div className="w-full">
      <h2 className="text-3xl font-bold text-primary text-center mb-4" data-testid="main-heading">
        `use` Hook vs. `useEffect` for Data Fetching
      </h2>
      <p className="mb-8 text-lg text-foreground text-center">
        This demo compares traditional data fetching with `useEffect` against the new `use` hook with Suspense and Error Boundaries.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
        <div className="flex-1 glass glass-lg" data-testid="use-effect-container">
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

        <div className="flex-1 glass glass-lg" data-testid="use-hook-container">
          <ErrorBoundary fallback={
            <div className="alert alert-danger">
              <h3 className="text-xl font-semibold mb-2" data-testid="use-hook-error-heading">Error with `use` Hook</h3>
              <p data-testid="use-hook-error-message">Failed to load data. Please try again.</p>
              <button
                onClick={handleRefetch}
                className="mt-3 btn btn-accent btn-sm"
              >
                Retry Fetch
              </button>
            </div>
          }>
            <Suspense fallback={
              <div className="alert alert-info">
                <h3 className="text-xl font-semibold mb-2" data-testid="use-hook-loading-message">Loading with `use` Hook...</h3>
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
  );
};