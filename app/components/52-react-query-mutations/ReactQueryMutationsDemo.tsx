"use client";

import React from 'react';
import PostsMutations from './PostsMutations';

const ReactQueryMutationsDemo: React.FC = () => {
  return (
    <div className="p-6 max-w-full mx-auto glass rounded-xl shadow-md space-y-4">
      <PostsMutations />
    </div>
  );
};

export { ReactQueryMutationsDemo };
