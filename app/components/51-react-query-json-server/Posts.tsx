"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post {
  id: string;
  title: string;
  author: string;
}

const JSON_SERVER_URL = 'http://localhost:3001';

const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await axios.get(`${JSON_SERVER_URL}/posts`);
  return data;
};

const Posts: React.FC = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Posts</h2>
      {data?.map((post) => (
        <div key={post.id} className="p-4 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg font-medium text-primary">{post.title}</h3>
          <p className="text-muted-foreground">Author: {post.author}</p>
        </div>
      ))}
    </div>
  );
};

export default Posts;