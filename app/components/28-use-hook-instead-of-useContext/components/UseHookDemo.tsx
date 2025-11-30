"use client";

import React from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { LegacyThemeDisplay } from '../LegacyThemeDisplay';
import { NewThemeDisplay } from '../NewThemeDisplay';

export const UseHookDemo: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="w-full">
        <h2 className="text-3xl font-bold text-primary text-center mb-4">React 19 `use` Hook vs. `useContext` Demo</h2>
        <p className="text-lg text-foreground text-center mb-8">This demo illustrates how to consume React Context using both the traditional `useContext` hook and the new `use` hook introduced in React 19.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LegacyThemeDisplay />
          <NewThemeDisplay />
        </div>
      </div>
    </ThemeProvider>
  );
};