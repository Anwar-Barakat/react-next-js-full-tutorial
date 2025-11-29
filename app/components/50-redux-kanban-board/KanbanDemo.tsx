"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import KanbanBoard from './KanbanBoard';

const KanbanDemo: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="p-6 max-w-full mx-auto glass rounded-xl shadow-md space-y-4">
        <KanbanBoard />
      </div>
    </Provider>
  );
};

export default KanbanDemo;
