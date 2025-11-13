'use client';
import React from "react";
import { useCounter } from "./CounterContext";

export const Counter: React.FC = () => {
  const { count, increment, decrement } = useCounter();

  return (
    <div className="p-6 border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-md)] bg-[var(--card)] text-[var(--foreground)] center-content">
      <div className="w-full">
        <h3 className="text-2xl font-semibold mb-6 center-text text-[var(--foreground)]">Context Counter</h3>
        <p className="text-5xl font-bold mb-6 center-text text-[var(--primary)]">{count}</p>
        <div className="center-content gap-4">
          <button
            onClick={increment}
            className="btn btn-primary"
          >
            Increment
          </button>
          <button
            onClick={decrement}
            className="btn btn-secondary"
          >
            Decrement
          </button>
        </div>
      </div>
    </div>
  );
};
