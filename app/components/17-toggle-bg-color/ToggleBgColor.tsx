'use client';
import React, { useState } from 'react';

export const ToggleBgColor = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="center-content py-12 px-4">
      <div className={`max-w-2xl w-full p-8 rounded-lg min-h-[200px] flex flex-col items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-muted' : 'bg-card'} border border-border shadow-md`}>
        <button
          onClick={handleToggle}
          className="btn btn-primary mb-5"
        >
          Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
        <input
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input w-full max-w-[300px]"
        />
        {searchTerm && (
          <p className="mt-5 text-foreground center-text">
            Searching for: <span className="font-semibold">{searchTerm}</span>
          </p>
        )}
      </div>
    </div>
  );
};
