import React, { useState } from 'react';

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <h2 data-testid="count-display">Count: {count}</h2>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
