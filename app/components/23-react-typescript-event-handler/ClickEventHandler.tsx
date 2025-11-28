'use client';
import React from 'react';

export const ClickEventHandler: React.FC = () => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // The 'event' object is fully typed, providing access to properties like 'target.value'
    alert(`Button clicked! Event type: ${event.type}`);
  };

  return (
    <div className="glass glass-lg w-full text-center">
      <h3 className="text-xl font-semibold mb-2 text-primary">Click Event Handler</h3>
      <p className="text-sm mb-4 text-foreground">
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