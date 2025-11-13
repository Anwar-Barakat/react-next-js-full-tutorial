'use client';
import React from 'react';
import { BasicState } from './BasicState';
import { UserProfile } from './UserProfile';
import { TodoList } from './TodoList';

export const StatefulComponentsContainer: React.FC = () => {
  return (
    <div className="center-content py-12 px-4 min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl w-full">
        <h2 className="text-3xl md:text-4xl font-bold center-text mb-8 text-[var(--foreground)]">useState Typing Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BasicState />
          <UserProfile />
          <TodoList />
        </div>
      </div>
    </div>
  );
};
