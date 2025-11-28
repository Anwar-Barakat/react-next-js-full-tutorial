'use client';
import React, { useState } from 'react';

export const ChangeEventHandler: React.FC = () => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // The 'event' object is fully typed, providing access to properties like 'target.value'
    setValue(event.target.value);
  };

  return (
    <div className="glass glass-lg w-full text-center">
      <h3 className="text-xl font-semibold mb-2 text-primary">Change Event Handler</h3>
      <p className="text-sm mb-4 text-foreground">
        Handles `onChange` events with `React.ChangeEvent`.
      </p>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type something..."
        className="input w-full mb-3 bg-white/10 border-white/20 focus:border-primary focus:bg-white/20"
      />
      <p className="text-foreground">Input value: <span className="font-mono bg-white/10 p-2 rounded-lg text-primary">{value || '...'}</span></p>
    </div>
  );
};