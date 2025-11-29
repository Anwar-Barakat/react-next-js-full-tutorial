"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { increment, decrement, incrementByAmount } from './counterSlice';

const Counter: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="p-4 border rounded-lg glass dark:border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground dark:text-foreground">Counter with Redux Toolkit</h2>
      <p className="text-xl mb-4 text-muted-foreground dark:text-muted-foreground">Count: <span className="font-semibold text-primary dark:text-primary text-3xl">{count}</span></p>
      <div className="flex space-x-2">
        <button
          className="btn bg-primary/50"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <button
          className="btn bg-secondary/50"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <button
          className="btn bg-accent/50"
          onClick={() => dispatch(incrementByAmount(5))}
        >
          Increment by 5
        </button>
      </div>
    </div>
  );
};

export default Counter;
