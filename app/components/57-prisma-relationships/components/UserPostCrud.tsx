'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface Post {
  id: number;
  title: string;
  content: string | null;
  author: {
    email: string;
    name: string | null;
  };
}

export const UserPostCrud: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
      setEmail('');
      setName('');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a user to create a post for.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, authorId: selectedUserId }),
      });
      if (!response.ok) throw new Error('Failed to create post');
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUsers(), fetchPosts()]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="p-4 border rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <form onSubmit={createUser} className="mb-6 space-y-3">
          <input
            type="email"
            placeholder="User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            placeholder="User Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add User
          </button>
        </form>
        <div>
          <h3 className="text-xl font-semibold mb-3">Users:</h3>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="p-2 border rounded bg-gray-50">
                {user.email} {user.name ? `(${user.name})` : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Post Management</h2>
        <form onSubmit={createPost} className="mb-6 space-y-3">
          <select
            value={selectedUserId ?? ''}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
            className="p-2 border rounded w-full"
          >
            <option value="" disabled>Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-2 border rounded w-full"
          />
          <textarea
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Create Post
          </button>
        </form>
        <div>
          <h3 className="text-xl font-semibold mb-3">Posts:</h3>
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.id} className="p-2 border rounded bg-gray-50">
                <p className="font-bold">{post.title}</p>
                <p>{post.content}</p>
                <p className="text-sm text-gray-500">
                  By: {post.author.name || post.author.email}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
