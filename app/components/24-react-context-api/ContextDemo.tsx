'use client';
import React from 'react';
import { CounterProvider } from './CounterContext';
import { Counter } from './Counter';

export const ContextDemo: React.FC = () => {
  return (
    <div className="w-full">
      <CounterProvider>
        <Counter />
      </CounterProvider>
    </div>
  );
};