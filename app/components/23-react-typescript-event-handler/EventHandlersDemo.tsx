'use client';
import React from 'react';
import { ClickEventHandler } from './ClickEventHandler';
import { ChangeEventHandler } from './ChangeEventHandler';
import { SubmitEventHandler } from './SubmitEventHandler';

export const EventHandlersDemo: React.FC = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">React TypeScript Event Handlers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <ClickEventHandler />
        <ChangeEventHandler />
        <SubmitEventHandler />
      </div>
    </div>
  );
};
