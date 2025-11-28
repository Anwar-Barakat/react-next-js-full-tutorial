'use client';

import React, { useReducer } from 'react';
import { counterReducer, initialCounterState } from './counterReducer';

const Counter = () => {
  const [state, dispatch] = useReducer(counterReducer, initialCounterState);

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full p-6 border border-border rounded-lg shadow-md bg-card text-foreground">
        <h3 className="text-2xl font-semibold mb-6 center-text text-foreground">useReducer Counter</h3>
        <p className="text-5xl font-bold mb-6 center-text text-primary">{state.count}</p>
        <div className="center-content gap-4 flex-wrap">
          <button
            onClick={() => dispatch({ type: 'increment' })}
            className="btn btn-primary"
          >
            Increment
          </button>
          <button
            onClick={() => dispatch({ type: 'decrement' })}
            className="btn btn-secondary"
          >
            Decrement
          </button>
          <button
            onClick={() => dispatch({ type: 'reset', payload: 0 })}
            className="btn btn-muted"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Counter