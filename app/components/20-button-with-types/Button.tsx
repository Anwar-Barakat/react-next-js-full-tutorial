'use client';
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean; // Optional prop
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: '5px',
    border: '1px solid #007bff',
    backgroundColor: disabled ? '#cccccc' : '#007bff',
    color: 'white',
    margin: '5px',
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <button onClick={onClick} disabled={disabled} style={buttonStyle}>
      {label}
    </button>
  );
};
