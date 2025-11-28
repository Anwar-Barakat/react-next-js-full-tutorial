"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostsMutations from './PostsMutations';

const queryClient = new QueryClient();

const ReactQueryMutationsDemo: React.FC = () => {
  return (
    <div className="p-6 max-w-full mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-4">
      <h1 className="text-3xl font-bold text-center heading-gradient mb-4">React Query Mutations Demo</h1>
      <PostsMutations />
    </div>
  );
};

export { ReactQueryMutationsDemo };
