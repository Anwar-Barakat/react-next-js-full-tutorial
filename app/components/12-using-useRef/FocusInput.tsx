'use client';
import { useRef } from 'react';

const FocusInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 center-text">
          Focus Input
        </h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            ref={inputRef} 
            placeholder="Click button to focus"
            className="input flex-1" 
          />
          <button 
            onClick={handleFocus}
            className="btn btn-primary"
          >
            Focus the input
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusInput;
