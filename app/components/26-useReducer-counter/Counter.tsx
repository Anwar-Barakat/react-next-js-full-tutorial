'use client';

import React, { useReducer } from 'react';
import { counterReducer, initialCounterState } from './counterReducer';

export const Counter = () => {
  const [state, dispatch] = useReducer(counterReducer, initialCounterState);

  return (
    <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md dark:bg-gray-800 text-gray-800 dark:text-white text-center">
      <h3 className="text-xl font-semibold mb-4">useReducer Counter</h3>
      <p className="text-5xl font-bold mb-4">{state.count}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => dispatch({ type: 'increment' })}
          className="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Increment
        </button>
        <button
          onClick={() => dispatch({ type: 'decrement' })}
          className="px-6 py-3 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          Decrement
        </button>
        <button
          onClick={() => dispatch({ type: 'reset', payload: 0 })}
          className="px-6 py-3 bg-gray-500 text-white text-lg rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
