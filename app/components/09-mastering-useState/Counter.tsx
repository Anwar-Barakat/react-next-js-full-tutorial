'use client';
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="center-content py-12 px-4 bg-gradient-to-br from-[var(--background)] via-[var(--muted)]/20 to-[var(--background)]">
      <div className="max-w-2xl w-full bg-gradient-to-br from-[var(--card)] to-[var(--muted)]/30 border border-[var(--border)] rounded-2xl p-8 md:p-10 shadow-[var(--shadow-lg)] backdrop-blur-sm">
        <h2 className="text-4xl md:text-5xl font-extrabold heading-gradient mb-8 center-text">
          Counter
        </h2>
        <div className="mb-8 center-content">
          <div className="inline-block px-8 py-6 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-2xl border-2 border-[var(--primary)]/30 shadow-[var(--shadow-md)]">
            <p className="text-4xl md:text-5xl font-bold text-[var(--primary)] center-text animate-in zoom-in duration-300">
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
