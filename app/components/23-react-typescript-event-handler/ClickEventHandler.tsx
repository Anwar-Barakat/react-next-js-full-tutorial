'use client';
import React from 'react';

export const ClickEventHandler: React.FC = () => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // The 'event' object is fully typed
    alert(`Button clicked! Event type: ${event.type}`);
  };

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md dark:bg-gray-800 text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-2">Click Event Handler</h3>
      <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
        Handles `onClick` events with `React.MouseEvent`.
      </p>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Click Me
      </button>
    </div>
  );
};
