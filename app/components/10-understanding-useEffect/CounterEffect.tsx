'use client';
import { useState, useEffect } from 'react';

const CounterEffect = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-2">Counter Effect</h2>
      <p className="mb-2">Current count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Increment
      </button>
    </div>
  );
};

export default CounterEffect;
