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
    <div className={`border border-[var(--border)] p-6 rounded-[var(--radius)] shadow-[var(--shadow-md)] ${theme === 'light' ? 'bg-[var(--card)] text-[var(--foreground)]' : 'bg-[var(--muted)] text-[var(--foreground)]'}`}>
      <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Legacy Theme Display (using `useContext`)</h3>
      <p className="mb-4 text-[var(--muted-foreground)]">Current Theme: <strong className="text-[var(--foreground)]">{theme}</strong></p>
      <button
        onClick={toggleTheme}
        className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
      >
        Toggle Theme
      </button>
    </div>
  );
};
