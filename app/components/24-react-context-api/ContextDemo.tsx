'use client';
import React from 'react';
import { CounterProvider } from './CounterContext';
import { Counter } from './Counter';

export const ContextDemo: React.FC = () => {
  return (
    <div className="center-content py-12 px-4 min-h-screen bg-background">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl md:text-4xl font-bold center-text mb-8 text-foreground">React Context API Example</h2>
        <CounterProvider>
          <Counter />
        </CounterProvider>
      </div>
    </div>
  );
};
