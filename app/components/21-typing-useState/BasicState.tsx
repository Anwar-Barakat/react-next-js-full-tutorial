'use client';
import React, { useState } from 'react';

export const BasicState: React.FC = () => {
  // Explicitly typing the state variable as a number
  const [count, setCount] = useState<number>(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md dark:bg-gray-800 text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-2">Basic useState Typing</h3>
      <p className="mb-2">Count: {count}</p>
      <button
        onClick={increment}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Increment
      </button>
    </div>
  );
};
