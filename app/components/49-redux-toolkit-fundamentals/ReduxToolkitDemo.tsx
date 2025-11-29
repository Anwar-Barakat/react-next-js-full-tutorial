"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Counter from './Counter';

const ReduxToolkitDemo: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="glass glass-lg">
        <Counter />
      </div>
    </Provider>
  );
};

export { ReduxToolkitDemo };
