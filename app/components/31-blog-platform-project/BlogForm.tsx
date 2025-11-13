"use client";

import React, { FC, useEffect, useState } from "react";
import { Blog, useBlogs } from "./BlogContext";

interface BlogFormProps {
  existingBlog?: Blog;
  onClose: () => void;
}

const BlogForm: FC<BlogFormProps> = ({ existingBlog, onClose }) => {
  const { addBlog, updateBlog } = useBlogs();
  const [title, setTitle] = useState(existingBlog?.title || "");
  const [description, setDescription] = useState(
    existingBlog?.description || ""
  );
  const [image, setImage] = useState(existingBlog?.image || "");
  const [time, setTime] = useState(existingBlog?.time || "");

  useEffect(() => {
    if (existingBlog) {
      setTitle(existingBlog.title);
      setDescription(existingBlog.description);
      setImage(existingBlog.image);
      setTime(existingBlog.time || ""); // Ensure time is a string
    } else {
      // Reset form for new blog if existingBlog is cleared
      setTitle("");
      setDescription("");
      setImage("");
      setTime("");
    }
  }, [existingBlog]); // Depend on existingBlog to reset/prefill form

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    const blogData: Omit<Blog, 'id'> = {
      title,
      description,
      image,
      time: time || new Date().toLocaleDateString(), // Default if not provided
    };

    if (existingBlog) {
      updateBlog({ ...blogData, id: existingBlog.id });
    } else {
      addBlog(blogData);
    }

    onClose(); // Close modal after submission
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg max-w-md mx-auto text-gray-900 dark:text-gray-50">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 h-24"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium mb-1">Image URL</label>
        <input
          type="text"
          id="image"
          name="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="time" className="block text-sm font-medium mb-1">Date (Optional)</label>
        <input
          type="date"
          id="time"
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-50 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {existingBlog ? "Update Blog" : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
