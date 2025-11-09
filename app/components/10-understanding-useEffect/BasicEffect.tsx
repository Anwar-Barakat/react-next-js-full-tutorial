'use client';
import { useEffect } from 'react';

const BasicEffect = () => {
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4 text-center text-gray-700">
      Basic Effect Component (Check console for mount message)
    </div>
  );
};

export default BasicEffect;
