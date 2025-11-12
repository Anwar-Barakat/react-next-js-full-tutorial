"use client";

import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const LegacyThemeDisplay: React.FC = () => {
  const themeContext = useContext(ThemeContext);

  if (themeContext === undefined) {
    throw new Error('LegacyThemeDisplay must be used within a ThemeProvider');
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <div className={`border border-gray-400 p-4 m-4 rounded-lg ${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-800 text-gray-100'}`}>
      <h3 className="text-lg font-semibold mb-2">Legacy Theme Display (using `useContext`)</h3>
      <p className="mb-2">Current Theme: <strong>{theme}</strong></p>
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded-md ${theme === 'light' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
      >
        Toggle Theme
      </button>
    </div>
  );
};
