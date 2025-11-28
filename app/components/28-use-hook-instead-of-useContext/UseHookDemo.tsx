"use client";

import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { LegacyThemeDisplay } from './LegacyThemeDisplay';
import { NewThemeDisplay } from './NewThemeDisplay';

export const UseHookDemo: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="center-content py-12 px-4 min-h-screen bg-background">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-4xl font-bold center-text mb-4 text-foreground">React 19 `use` Hook vs. `useContext` Demo</h2>
          <p className="text-lg center-text mb-8 text-muted-foreground">This demo illustrates how to consume React Context using both the traditional `useContext` hook and the new `use` hook introduced in React 19.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LegacyThemeDisplay />
            <NewThemeDisplay />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
