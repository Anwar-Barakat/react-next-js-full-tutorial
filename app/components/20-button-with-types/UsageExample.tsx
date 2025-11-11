'use client';
import React from 'react';
import { Button } from './Button';

export const UsageExample: React.FC = () => {
  const handleEnabledButtonClick = () => {
    alert('Enabled button clicked!');
  };

  const handleDisabledButtonClick = () => {
    alert('This alert should not show if the button is disabled.');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f0f0f0', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Button Component Usage</h2>
      <div style={{ marginBottom: '20px' }}>
        <Button label="Click Me" onClick={handleEnabledButtonClick} />
      </div>
      <div>
        <Button label="Disabled Button" onClick={handleDisabledButtonClick} disabled />
      </div>
    </div>
  );
};
