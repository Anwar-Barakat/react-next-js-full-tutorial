"use client";

import React from 'react';
import Posts from './Posts';

const ReactQueryDemo: React.FC = () => {
  return (
    <div className="p-6 max-w-full mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-4">
      <h1 className="text-3xl font-bold text-center heading-gradient mb-4">React Query Posts Demo</h1>
      <Posts />
    </div>
  );
};

export { ReactQueryDemo };
