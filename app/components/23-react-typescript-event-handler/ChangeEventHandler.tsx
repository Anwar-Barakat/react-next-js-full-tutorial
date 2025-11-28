'use client';
import React, { useState } from 'react';

export const ChangeEventHandler: React.FC = () => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // The 'event' object is fully typed, providing access to properties like 'target.value'
    setValue(event.target.value);
  };

  return (
    <div className="p-6 border border-border rounded-lg shadow-md bg-card text-foreground">
      <h3 className="text-xl font-semibold mb-2 text-foreground">Change Event Handler</h3>
      <p className="text-sm mb-4 text-muted-foreground">
        Handles `onChange` events with `React.ChangeEvent`.
      </p>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type something..."
        className="input w-full mb-3"
      />
      <p className="text-muted-foreground">Input value: <span className="font-mono bg-muted p-2 rounded-lg text-foreground">{value || '...'}</span></p>
    </div>
  );
};
