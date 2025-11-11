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

  const containerClasses = isDarkMode
    ? 'bg-gray-800 text-white'
    : 'bg-gray-100 text-gray-800';

  return (
    <div className={`p-8 rounded-lg min-h-[200px] flex flex-col items-center justify-center transition-colors duration-300 ${containerClasses}`}>
      <button
        onClick={handleToggle}
        className="px-5 py-2.5 text-base cursor-pointer rounded-md border border-gray-300 mb-5"
      >
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
      <input
        type="search"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="p-2.5 text-base w-[300px] rounded-md border border-gray-300"
      />
      {searchTerm && <p className="mt-5">Searching for: {searchTerm}</p>}
    </div>
  );
};
