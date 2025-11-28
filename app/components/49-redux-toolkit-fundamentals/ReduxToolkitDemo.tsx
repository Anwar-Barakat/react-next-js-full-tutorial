"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Counter from './Counter';

const ReduxToolkitDemo: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="card card-hover card-lg">
        <h1 className="text-3xl font-bold text-center text-primary mb-4">Redux Toolkit Counter Demo</h1>
        <Counter />
      </div>
    </Provider>
  );
};

export { ReduxToolkitDemo };
