'use client';
import { Button } from './Button';

export const ButtonDemo = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Button Usage Example</h2>
      <div className="flex gap-4">
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