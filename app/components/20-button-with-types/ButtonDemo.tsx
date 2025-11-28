'use client';
import { Button } from './Button';

export const ButtonDemo = () => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 md:p-8 shadow-md">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 center-text">
          Button Usage Example
        </h2>
        <div className="center-content gap-4">
          <Button variant="primary" onClick={() => alert('Primary button clicked!')}>
            Primary Button
          </Button>
          <Button variant="secondary" onClick={() => alert('Secondary button clicked!')}>
            Secondary Button
          </Button>
        </div>
      </div>
    </div>
  );
};