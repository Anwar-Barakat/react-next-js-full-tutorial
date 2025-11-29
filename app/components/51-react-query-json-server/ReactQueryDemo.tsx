"use client";

import React from 'react';
import Posts from './Posts';

const ReactQueryDemo: React.FC = () => {
  return (
    <div className="p-6 max-w-full mx-auto glass rounded-xl shadow-md space-y-4">
      <Posts />
    </div>
  );
};

export { ReactQueryDemo };
