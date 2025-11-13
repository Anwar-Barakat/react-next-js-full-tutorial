'use client';
import React, { useState } from 'react';

export const ChangeEventHandler: React.FC = () => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // The 'event' object is fully typed, providing access to properties like 'target.value'
    setValue(event.target.value);
  };

  return (
    <div className="p-6 border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-md)] bg-[var(--card)] text-[var(--foreground)]">
      <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Change Event Handler</h3>
      <p className="text-sm mb-4 text-[var(--muted-foreground)]">
        Handles `onChange` events with `React.ChangeEvent`.
      </p>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type something..."
        className="input w-full mb-3"
      />
      <p className="text-[var(--muted-foreground)]">Input value: <span className="font-mono bg-[var(--muted)] p-2 rounded-[var(--radius)] text-[var(--foreground)]">{value || '...'}</span></p>
    </div>
  );
};
