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
    <div className="glass glass-lg w-full text-center">
      <h3 className="text-xl font-semibold mb-4 text-primary">Legacy Theme Display (using `useContext`)</h3>
      <p className="mb-4 text-foreground">Current Theme: <strong className="text-accent">{theme}</strong></p>
      <button
        onClick={toggleTheme}
        className={`btn ${theme === 'light' ? 'bg-primary' : 'bg-secondary'}`}
      >
        Toggle Theme
      </button>
    </div>
  );
};