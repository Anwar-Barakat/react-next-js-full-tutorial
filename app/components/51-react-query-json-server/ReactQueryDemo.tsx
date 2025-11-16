"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Posts from './Posts';

const queryClient = new QueryClient();

const ReactQueryDemo: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6 max-w-full mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-4">
        <h1 className="text-3xl font-bold text-center heading-gradient mb-4">React Query Posts Demo</h1>
        <Posts />
      </div>
    </QueryClientProvider>
  );
};

export default ReactQueryDemo;
