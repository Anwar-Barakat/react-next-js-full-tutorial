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
  const contextValue = React.use(ThemeContext); // Assuming React.use is available
  if (!contextValue) {
    throw new Error('NewThemeDisplay must be used within a ThemeProvider');
  }
  const { theme, toggleTheme } = contextValue;

  return (
    <div className={`border border-[var(--border)] p-6 rounded-[var(--radius)] shadow-[var(--shadow-md)] ${theme === 'light' ? 'bg-[var(--card)] text-[var(--foreground)]' : 'bg-[var(--muted)] text-[var(--foreground)]'}`}>
      <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">New Theme Display (using `use` hook)</h3>
      <p className="mb-4 text-[var(--muted-foreground)]">Current Theme: <strong className="text-[var(--foreground)]">{theme}</strong></p>
      <button
        onClick={toggleTheme}
        className={`btn ${theme === 'light' ? 'btn-accent' : 'btn-primary'}`}
      >
        Toggle Theme
      </button>
    </div>
  );
};

