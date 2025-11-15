"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { increment, decrement, incrementByAmount } from './counterSlice';

const Counter: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Counter with Redux Toolkit</h2>
      <p className="text-xl mb-4 text-gray-700 dark:text-gray-300">Count: <span className="font-semibold text-blue-600 dark:text-blue-400 text-3xl">{count}</span></p>
      <div className="flex space-x-2">
        <button
          className="btn btn-primary"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <button
          className="btn btn-danger"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <button
          className="btn btn-accent"
          onClick={() => dispatch(incrementByAmount(5))}
        >
          Increment by 5
        </button>
      </div>
    </div>
  );
};

export default Counter;
