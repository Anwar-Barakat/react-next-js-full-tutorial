"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  author: string;
}

const JSON_SERVER_URL = 'http://localhost:3001';

// --- API Functions ---
const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await axios.get(`${JSON_SERVER_URL}/posts`);
  return data;
};

const createPost = async (newPost: Omit<Post, 'id'>): Promise<Post> => {
  const { data } = await axios.post(`${JSON_SERVER_URL}/posts`, newPost);
  return data;
};

const updatePost = async (updatedPost: Post): Promise<Post> => {
  const { data } = await axios.put(`${JSON_SERVER_URL}/posts/${updatedPost.id}`, updatedPost);
  return data;
};

const deletePost = async (postId: string): Promise<void> => {
  await axios.delete(`${JSON_SERVER_URL}/posts/${postId}`);
};

const PostsMutations: React.FC = () => {
  const queryClient = useQueryClient();
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostAuthor, setNewPostAuthor] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  // --- Query for Posts ---
  const { data: posts, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  // --- Mutation for Creating Post ---
  const addPostMutation = useMutation<Post, Error, Omit<Post, 'id'>>({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setNewPostTitle('');
      setNewPostAuthor('');
    },
  });

  // --- Mutation for Updating Post ---
  const updatePostMutation = useMutation<Post, Error, Post>({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setEditingPostId(null);
    },
  });

  // --- Mutation for Deleting Post (with Optimistic Update) ---
  const deletePostMutation = useMutation<void, Error, string>({
    mutationFn: deletePost,
    onMutate: async (postIdToDelete) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);

      // Optimistically update to the new value
      queryClient.setQueryData<Post[]>(
        ['posts'],
        (old) => old?.filter((post) => post.id !== postIdToDelete) || []
      );

      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (err, postIdToDelete, context) => {
      // If the mutation fails, use the context here to roll back
      queryClient.setQueryData(['posts'], context?.previousPosts);
      alert(`Failed to delete post: ${err.message}`);
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // --- Handlers ---
  const handleAddPost = () => {
    if (newPostTitle.trim() && newPostAuthor.trim()) {
      addPostMutation.mutate({ title: newPostTitle, author: newPostAuthor });
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditAuthor(post.author);
  };

  const handleUpdatePost = (postId: string) => {
    if (editTitle.trim() && editAuthor.trim()) {
      updatePostMutation.mutate({ id: postId, title: editTitle, author: editAuthor });
    }
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error fetching posts: {error.message}</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Posts Management</h2>

      {/* Add New Post Form */}
      <div className="card p-4 space-y-3">
        <h3 className="text-xl font-semibold heading-gradient">Add New Post</h3>
        <input
          type="text"
          placeholder="Post Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="input w-full"
        />
        <input
          type="text"
          placeholder="Author"
          value={newPostAuthor}
          onChange={(e) => setNewPostAuthor(e.target.value)}
          className="input w-full"
        />
        <button
          onClick={handleAddPost}
          disabled={addPostMutation.isPending}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          {addPostMutation.isPending ? 'Adding...' : <><Plus className="w-4 h-4" /> Add Post</>}
        </button>
        {addPostMutation.isError && (
          <p className="text-red-500 text-sm mt-2">Error adding post: {addPostMutation.error?.message}</p>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold heading-gradient">Existing Posts</h3>
        {posts?.length === 0 && <p className="text-gray-600 dark:text-gray-400">No posts available.</p>}
        {posts?.map((post) => (
          <div key={post.id} className="card p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            {editingPostId === post.id ? (
              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input w-full"
                />
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="input w-full"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdatePost(post.id)}
                    disabled={updatePostMutation.isPending}
                    className="btn btn-primary btn-sm flex-1 flex items-center justify-center gap-1"
                  >
                    {updatePostMutation.isPending ? 'Saving...' : <><Check className="w-4 h-4" /> Save</>}
                  </button>
                  <button
                    onClick={() => setEditingPostId(null)}
                    className="btn btn-muted btn-sm flex-1 flex items-center justify-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 text-left">
                  <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400">{post.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Author: {post.author}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditClick(post)}
                    className="btn btn-secondary btn-sm flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletePostMutation.isPending && deletePostMutation.variables === post.id}
                    className="btn btn-danger btn-sm flex items-center gap-1"
                  >
                    {deletePostMutation.isPending && deletePostMutation.variables === post.id ? 'Deleting...' : <><Trash2 className="w-4 h-4" /> Delete</>}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsMutations;
