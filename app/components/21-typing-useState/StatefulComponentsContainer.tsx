'use client';
import React from 'react';
import { BasicState } from './BasicState';
import { UserProfile } from './UserProfile';
import { TodoList } from './TodoList';

export const StatefulComponentsContainer: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-primary text-center mb-8">useState Typing Examples</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BasicState />
        <UserProfile />
        <TodoList />
      </div>
    </div>
  );
};