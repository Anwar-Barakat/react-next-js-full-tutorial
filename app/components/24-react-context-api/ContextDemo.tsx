'use client';
import React from 'react';
import { CounterProvider } from './CounterContext';
import { Counter } from './Counter';

export const ContextDemo: React.FC = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-center mb-8">React Context API Example</h2>
      <CounterProvider>
        <Counter />
      </CounterProvider>
    </div>
  );
};
