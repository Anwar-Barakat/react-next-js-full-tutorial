import React from 'react';

interface DisplayDataProps {
  name: string;
  age?: number; // age is optional
}

export const DisplayData: React.FC<DisplayDataProps> = ({ name, age }) => {
  return (
    <div>
      <h2>Name: {name}</h2>
      {age && <p>Age: {age}</p>}
      {!age && <p>Age: Not provided</p>}
    </div>
  );
};
