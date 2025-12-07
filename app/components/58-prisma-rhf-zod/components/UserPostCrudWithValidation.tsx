'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userSchema } from './user.schema';
import { postSchema } from './post.schema';
import { createUser } from '../actions/user.actions';
import { createPost } from '../actions/post.actions';

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

type UserFormData = z.infer<typeof userSchema>;
type PostFormData = z.infer<typeof postSchema>;

export const UserPostCrudWithValidation: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register: registerUser,
    handleSubmit: handleUserSubmit,
    reset: resetUserForm,
    formState: { errors: userErrors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const {
    register: registerPost,
    handleSubmit: handlePostSubmit,
    reset: resetPostForm,
    setValue: setPostValue,
    formState: { errors: postErrors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

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

  const onUserSubmit = (data: UserFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);
      if (data.name) {
        formData.append('name', data.name);
      }
      const result = await createUser(formData);
      if (result?.errors) {
        // Handle server-side validation errors
      } else {
        resetUserForm();
        fetchUsers();
      }
    });
  };

  const onPostSubmit = (data: PostFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.content) {
        formData.append('content', data.content);
      }
      formData.append('authorId', String(data.authorId));
      const result = await createPost(formData);
      if (result?.errors) {
        // Handle server-side validation errors
      } else {
        resetPostForm();
        fetchPosts();
      }
    });
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
        <form onSubmit={handleUserSubmit(onUserSubmit)} className="mb-6 space-y-3">
          <input
            type="email"
            placeholder="User Email"
            {...registerUser('email')}
            className="p-2 border rounded w-full"
          />
          {userErrors.email && <p className="text-red-500">{userErrors.email.message}</p>}
          <input
            type="text"
            placeholder="User Name"
            {...registerUser('name')}
            className="p-2 border rounded w-full"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={isPending}>
            {isPending ? 'Adding User...' : 'Add User'}
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
        <form onSubmit={handlePostSubmit(onPostSubmit)} className="mb-6 space-y-3">
          <select
            {...registerPost('authorId', { setValueAs: (value) => Number(value) })}
            className="p-2 border rounded w-full"
            onChange={(e) => setPostValue('authorId', Number(e.target.value))}
          >
            <option value="" disabled>Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
          {postErrors.authorId && <p className="text-red-500">{postErrors.authorId.message}</p>}
          <input
            type="text"
            placeholder="Post Title"
            {...registerPost('title')}
            className="p-2 border rounded w-full"
          />
          {postErrors.title && <p className="text-red-500">{postErrors.title.message}</p>}
          <textarea
            placeholder="Post Content"
            {...registerPost('content')}
            className="p-2 border rounded w-full"
          />
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" disabled={isPending}>
            {isPending ? 'Creating Post...' : 'Create Post'}
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