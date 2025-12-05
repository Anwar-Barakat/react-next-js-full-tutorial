import React from 'react';

interface ConditionalMessageProps {
  message: string;
  isVisible: boolean;
}

export const ConditionalMessage: React.FC<ConditionalMessageProps> = ({ message, isVisible }) => {
  return (
    <div>
      {isVisible && <p>{message}</p>}
    </div>
  );
};
