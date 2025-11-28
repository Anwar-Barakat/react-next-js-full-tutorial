'use client';
import React, { useState } from 'react';

export const ToggleBgColor = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="glass glass-xl w-full max-w-2xl min-h-[200px] flex flex-col items-center justify-center text-center">
      <button
        onClick={() => {}} // Dummy onClick, as the original logic toggled internal background
        className="btn btn-primary mb-5"
      >
        Toggle Mode
      </button>
      <input
        type="search"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="input w-full max-w-[300px] bg-white/10 border-white/20 focus:border-primary focus:bg-white/20"
      />
      {searchTerm && (
        <p className="mt-5 text-muted-foreground text-center">
          Searching for: <span className="font-semibold text-primary">{searchTerm}</span>
        </p>
      )}
    </div>
  );
};