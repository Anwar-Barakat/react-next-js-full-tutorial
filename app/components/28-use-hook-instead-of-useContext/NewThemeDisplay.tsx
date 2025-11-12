"use client";

import React from 'react';
import { ThemeContext } from './ThemeContext';

// In a React 19 compatible environment, the 'use' hook would be available globally
// or imported from 'react'. For demonstration purposes, we'll assume its availability.
// If you are not on React 19, this will cause a runtime error.

export const NewThemeDisplay: React.FC = () => {
  // The new 'use' hook simplifies context consumption
  // It can be called conditionally and inside loops, unlike useContext
  // It also integrates with Suspense for data fetching.
  // For context, it directly reads the context value.
  // If ThemeContext.Provider is not found, it will suspend or throw an error,
  // similar to how useContext would throw an error if the context value is undefined.
  const { theme, toggleTheme } = React.use(ThemeContext); // Assuming React.use is available

  return (
    <div className={`border border-gray-400 p-4 m-4 rounded-lg ${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-800 text-gray-100'}`}>
      <h3 className="text-lg font-semibold mb-2">New Theme Display (using `use` hook)</h3>
      <p className="mb-2">Current Theme: <strong>{theme}</strong></p>
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded-md ${theme === 'light' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
      >
        Toggle Theme
      </button>
    </div>
  );
};

