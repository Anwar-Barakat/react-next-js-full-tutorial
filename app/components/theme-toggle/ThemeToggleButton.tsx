'use client';

import React from 'react';
import { useTheme } from '../../providers'; // Assuming providers is one level up
import SunIcon from './SunIcon';
import MoonIcon from './MoonIcon';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-muted p-2 rounded-full flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggleButton;
