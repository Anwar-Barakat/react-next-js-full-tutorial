'use client';
import { useState, useEffect, useRef } from 'react';

const Timer = () => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full themed-card p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 center-text">
          Timer
        </h2>
        <p className="text-3xl font-bold text-secondary mb-6 center-text">
          Count: {count}
        </p>
        <div className="center-content">
          <button 
            onClick={() => {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
            }}
            className="btn btn-secondary"
          >
            Stop Timer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
