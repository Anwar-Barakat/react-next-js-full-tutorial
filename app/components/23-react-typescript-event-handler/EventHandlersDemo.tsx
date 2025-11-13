'use client';
import React from 'react';
import { ClickEventHandler } from './ClickEventHandler';
import { ChangeEventHandler } from './ChangeEventHandler';
import { SubmitEventHandler } from './SubmitEventHandler';

export const EventHandlersDemo: React.FC = () => {
  return (
    <div className="center-content py-12 px-4 min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl w-full">
        <h2 className="text-3xl md:text-4xl font-bold center-text mb-8 text-[var(--foreground)]">React TypeScript Event Handlers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ClickEventHandler />
          <ChangeEventHandler />
          <SubmitEventHandler />
        </div>
      </div>
    </div>
  );
};
