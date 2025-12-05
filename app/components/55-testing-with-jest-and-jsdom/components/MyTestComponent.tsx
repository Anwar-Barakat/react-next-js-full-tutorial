import React from 'react';

interface MyTestComponentProps {
  message: string;
  onClick?: () => void;
}

export const MyTestComponent: React.FC<MyTestComponentProps> = ({ message, onClick }) => {
  return (
    <div>
      <h1>{message}</h1>
      <button onClick={onClick}>Click Me</button>
    </div>
  );
};
