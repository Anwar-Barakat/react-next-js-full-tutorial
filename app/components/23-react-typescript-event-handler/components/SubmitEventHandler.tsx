'use client';
import React, { useState } from 'react';

export const SubmitEventHandler: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('Default Value');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(`Form submitted with value: ${inputValue}`);
  };

  return (
    <div className="glass glass-lg w-full text-center">
      <h3 className="text-xl font-semibold mb-2 text-primary">Submit Event Handler</h3>
      <p className="text-sm mb-4 text-foreground">
        Handles `onSubmit` events with `React.FormEvent`.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input w-full mb-3 bg-white border-white focus:border-primary focus:bg-white"
        />
        <button
          type="submit"
          className="btn bg-accent w-full"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};