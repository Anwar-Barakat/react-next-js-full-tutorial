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

  const containerStyle = {
    backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
    color: isDarkMode ? '#fff' : '#333',
    padding: '2rem',
    borderRadius: '8px',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '20px',
  };

  const searchInputStyle = {
    padding: '10px',
    fontSize: '1rem',
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  return (
    <div style={containerStyle}>
      <button onClick={handleToggle} style={buttonStyle}>
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
      <input
        type="search"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={searchInputStyle}
      />
      {searchTerm && <p style={{ marginTop: '20px' }}>Searching for: {searchTerm}</p>}
    </div>
  );
};
