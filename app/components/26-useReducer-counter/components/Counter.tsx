'use client';

import React, { useReducer } from 'react';
import { counterReducer, initialCounterState } from '../counterReducer';

const Counter = () => {
  const [state, dispatch] = useReducer(counterReducer, initialCounterState);

  return (
    <div className="glass glass-xl w-full max-w-2xl text-center">
      <p className="text-5xl font-bold mb-6 text-accent">{state.count}</p>
      <div className="flex justify-center gap-4 flex-wrap">
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
  );
};

export default Counter