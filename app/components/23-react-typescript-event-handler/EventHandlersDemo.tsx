'use client';
import React from 'react';
import { ClickEventHandler } from './ClickEventHandler';
import { ChangeEventHandler } from './ChangeEventHandler';
import { SubmitEventHandler } from './SubmitEventHandler';

export const EventHandlersDemo: React.FC = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <ClickEventHandler />
        <ChangeEventHandler />
        <SubmitEventHandler />
      </div>
    </div>
  );
};