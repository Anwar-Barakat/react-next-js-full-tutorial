"use client";

import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { LegacyThemeDisplay } from './LegacyThemeDisplay';
import { NewThemeDisplay } from './NewThemeDisplay';

export const UseHookDemo: React.FC = () => {
  return (
    <ThemeProvider>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h2>React 19 `use` Hook vs. `useContext` Demo</h2>
        <p>This demo illustrates how to consume React Context using both the traditional `useContext` hook and the new `use` hook introduced in React 19.</p>
        <LegacyThemeDisplay />
        <NewThemeDisplay />
      </div>
    </ThemeProvider>
  );
};
