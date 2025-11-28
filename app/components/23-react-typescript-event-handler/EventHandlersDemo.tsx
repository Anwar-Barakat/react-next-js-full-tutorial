'use client';
import React from 'react';
import { ClickEventHandler } from './ClickEventHandler';
import { ChangeEventHandler } from './ChangeEventHandler';
import { SubmitEventHandler } from './SubmitEventHandler';

export const EventHandlersDemo: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-primary text-center mb-8">React TypeScript Event Handlers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ClickEventHandler />
        <ChangeEventHandler />
        <SubmitEventHandler />
      </div>
    </div>
  );
};