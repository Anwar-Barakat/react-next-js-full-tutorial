'use client';

import React from 'react';

// Define the shape of our context value
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Create the context with a default undefined value
// We'll provide a non-null value in the ThemeProvider
export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);
