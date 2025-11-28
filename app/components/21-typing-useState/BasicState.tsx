'use client';
import React, { useState } from 'react';

export const BasicState: React.FC = () => {
  // Explicitly typing the state variable as a number
  const [count, setCount] = useState<number>(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div className="glass glass-lg w-full text-center">
      <h3 className="text-xl font-semibold mb-4 text-primary">Basic useState Typing</h3>
      <p className="mb-4 text-lg text-foreground">Count: <span className="font-bold text-accent">{count}</span></p>
      <button
        onClick={increment}
        className="btn btn-primary"
      >
        Increment
      </button>
    </div>
  );
};