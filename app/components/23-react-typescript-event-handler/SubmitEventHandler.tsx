'use client';
import React, { useState } from 'react';

export const SubmitEventHandler: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('Default Value');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // The 'event' object is fully typed
    event.preventDefault();
    alert(`Form submitted with value: ${inputValue}`);
  };

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md dark:bg-gray-800 text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-2">Submit Event Handler</h3>
      <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
        Handles `onSubmit` events with `React.FormEvent`.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};
