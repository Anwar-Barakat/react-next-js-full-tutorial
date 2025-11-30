'use client';
import { Button } from './Button';

export const ButtonDemo = () => {
  return (
    <div className="glass glass-xl w-full max-w-2xl text-center">
      <h2 className="text-3xl font-bold text-primary mb-6">
        Button Usage Example
      </h2>
      <div className="flex justify-center gap-4">
        <Button variant="primary" onClick={() => alert('Primary button clicked!')}>
          Primary Button
        </Button>
        <Button variant="secondary" onClick={() => alert('Secondary button clicked!')}>
          Secondary Button
        </Button>
      </div>
    </div>
  );
};