'use client';
import React from 'react';
import { CounterProvider } from './CounterContext';
import { Counter } from './Counter';

export const ContextDemo: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-primary text-center mb-8">React Context API Example</h2>
      <CounterProvider>
        <Counter />
      </CounterProvider>
    </div>
  );
};