"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post {
  id: string;
  title: string;
  author: string;
}

const JSON_SERVER_URL = 'http://localhost:3001'; // Define the constant URL

const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await axios.get(`${JSON_SERVER_URL}/posts`); // Use the constant URL
  return data;
};

const Posts: React.FC = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Posts</h2>
      {data?.map((post) => (
        <div key={post.id} className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">{post.title}</h3>
          <p className="text-gray-700 dark:text-gray-300">Author: {post.author}</p>
        </div>
      ))}
    </div>
  );
};

export default Posts;
