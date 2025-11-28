'use client';
import { useEffect } from 'react';

const BasicEffect = () => {
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full glass rounded-lg p-6 md:p-8">
        <p className="text-lg text-muted-foreground center-text">
          Basic Effect Component (Check console for mount message)
        </p>
      </div>
    </div>
  );
};

export default BasicEffect;
