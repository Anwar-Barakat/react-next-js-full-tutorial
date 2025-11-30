'use client';
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full glass rounded-2xl p-8 md:p-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-8 center-text">
          Counter
        </h2>
        <div className="mb-8 center-content">
          <div className="inline-block px-8 py-6 bg-muted rounded-2xl border-2 border-primary/30">
            <p className="text-4xl md:text-5xl font-bold text-primary center-text animate-in zoom-in duration-300">
              {count}
            </p>
          </div>
        </div>
        <div className="center-content">
          <button 
            onClick={() => setCount(count + 1)}
            className="btn btn-primary btn-lg"
          >
            + Increment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Counter;
