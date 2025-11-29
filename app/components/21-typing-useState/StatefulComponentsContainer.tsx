'use client';
import React from 'react';
import { BasicState } from './BasicState';
import { UserProfile } from './UserProfile';
import { TodoList } from './TodoList';

export const StatefulComponentsContainer: React.FC = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <BasicState />
        <UserProfile />
        <TodoList />
      </div>
    </div>
  );
};