'use client';
import { useState, useEffect } from 'react';

const CounterEffect = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 md:p-8 shadow-md">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 center-text">
          Counter Effect
        </h2>
        <p className="text-2xl font-semibold text-accent mb-6 center-text">
          Current count: {count}
        </p>
        <div className="center-content">
          <button 
            onClick={() => setCount(count + 1)}
            className="btn btn-accent"
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterEffect;
