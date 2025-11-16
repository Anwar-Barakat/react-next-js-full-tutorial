"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import KanbanBoard from './KanbanBoard';

const KanbanDemo: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="p-6 max-w-full mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-4">
        <h1 className="text-3xl font-bold text-center heading-gradient mb-4">Redux Toolkit Kanban Board</h1>
        <KanbanBoard />
      </div>
    </Provider>
  );
};

export default KanbanDemo;
