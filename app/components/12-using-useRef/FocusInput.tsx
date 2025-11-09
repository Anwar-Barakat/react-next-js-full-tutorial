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
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-2">Focus Input</h2>
      <input type="text" ref={inputRef} className="p-2 border border-gray-300 rounded mr-2" />
      <button 
        onClick={handleFocus}
        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        Focus the input
      </button>
    </div>
  );
};

export default FocusInput;
