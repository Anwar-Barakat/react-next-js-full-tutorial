'use client';
import React, { useState } from 'react';

export const SubmitEventHandler: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('Default Value');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // The 'event' object is fully typed
    event.preventDefault();
    alert(`Form submitted with value: ${inputValue}`);
  };

  return (
    <div className="p-6 border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-md)] bg-[var(--card)] text-[var(--foreground)]">
      <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Submit Event Handler</h3>
      <p className="text-sm mb-4 text-[var(--muted-foreground)]">
        Handles `onSubmit` events with `React.FormEvent`.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input w-full mb-3"
        />
        <button
          type="submit"
          className="btn btn-accent w-full"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};
