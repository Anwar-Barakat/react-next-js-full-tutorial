"use client";

import React from 'react';
import { ThemeContext } from './ThemeContext';

export const NewThemeDisplay: React.FC = () => {
  const contextValue = React.use(ThemeContext);
  if (!contextValue) {
    throw new Error('NewThemeDisplay must be used within a ThemeProvider');
  }
  const { theme, toggleTheme } = contextValue;

  return (
    <div className="glass glass-lg w-full text-center">
      <h3 className="text-xl font-semibold mb-4 text-primary">New Theme Display (using `use` hook)</h3>
      <p className="mb-4 text-foreground">Current Theme: <strong className="text-accent">{theme}</strong></p>
      <button
        onClick={toggleTheme}
        className={`btn ${theme === 'light' ? 'bg-accent' : 'bg-primary'}`}
      >
        Toggle Theme
      </button>
    </div>
  );
};