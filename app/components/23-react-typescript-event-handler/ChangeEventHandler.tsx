'use client';
import React, { useState } from 'react';

export const ChangeEventHandler: React.FC = () => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // The 'event' object is fully typed, providing access to properties like 'target.value'
    setValue(event.target.value);
  };

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md dark:bg-gray-800 text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-2">Change Event Handler</h3>
      <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
        Handles `onChange` events with `React.ChangeEvent`.
      </p>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type something..."
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="mt-2">Input value: <span className="font-mono bg-gray-200 dark:bg-gray-900 p-1 rounded">{value}</span></p>
    </div>
  );
};
