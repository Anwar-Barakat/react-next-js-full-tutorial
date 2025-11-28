'use client';
import React from "react";
import { useCounter } from "./CounterContext";

export const Counter: React.FC = () => {
  const { count, increment, decrement } = useCounter();

  return (
    <div className="glass glass-lg w-full text-center">
      <h3 className="text-2xl font-semibold mb-6 text-primary">Context Counter</h3>
      <p className="text-5xl font-bold mb-6 text-accent">{count}</p>
      <div className="flex justify-center gap-4">
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
  );
};