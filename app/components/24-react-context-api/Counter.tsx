'use client';
import React from "react";
import { useCounter } from "./CounterContext";

export const Counter: React.FC = () => {
  const { count, increment, decrement } = useCounter();

  return (
    <div className="p-6 border border-border rounded-lg shadow-md bg-card text-foreground center-content">
      <div className="w-full">
        <h3 className="text-2xl font-semibold mb-6 center-text text-foreground">Context Counter</h3>
        <p className="text-5xl font-bold mb-6 center-text text-primary">{count}</p>
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
