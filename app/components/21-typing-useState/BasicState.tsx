'use client';
import React, { useState } from 'react';

export const BasicState: React.FC = () => {
  // Explicitly typing the state variable as a number
  const [count, setCount] = useState<number>(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div className="p-6 border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-md)] bg-[var(--card)] text-[var(--foreground)]">
      <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Basic useState Typing</h3>
      <p className="mb-4 text-lg text-[var(--muted-foreground)]">Count: <span className="font-bold text-[var(--primary)]">{count}</span></p>
      <button
        onClick={increment}
        className="btn btn-primary"
      >
        Increment
      </button>
    </div>
  );
};
