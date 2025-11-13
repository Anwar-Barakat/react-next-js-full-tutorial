'use client';
import React from 'react';

export const ClickEventHandler: React.FC = () => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // The 'event' object is fully typed
    alert(`Button clicked! Event type: ${event.type}`);
  };

  return (
    <div className="p-6 border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-md)] bg-[var(--card)] text-[var(--foreground)]">
      <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Click Event Handler</h3>
      <p className="text-sm mb-4 text-[var(--muted-foreground)]">
        Handles `onClick` events with `React.MouseEvent`.
      </p>
      <button
        onClick={handleClick}
        className="btn btn-primary"
      >
        Click Me
      </button>
    </div>
  );
};
