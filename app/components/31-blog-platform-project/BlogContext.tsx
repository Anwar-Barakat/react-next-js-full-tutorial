"use client";

import React, { FC, createContext, useContext, useState, ReactNode } from "react";

export type Blog = {
  id: string; // Changed to string for UUID or similar
  title: string;
  description: string;
  image: string;
  time?: string; // Optional, could be Date type
};

interface BlogContextType {
  blogs: Blog[];
  addBlog: (blog: Omit<Blog, 'id'>) => void; // id will be generated
  updateBlog: (blog: Blog) => void;
  deleteBlog: (id: string) => void;
}

export const BlogContext = createContext<BlogContextType | undefined>(
  undefined
);

const BlogProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const addBlog = (newBlog: Omit<Blog, 'id'>) => {
    const blogWithId: Blog = {
      ...newBlog,
      id: String(Date.now()), // Simple ID generation
      time: newBlog.time || new Date().toLocaleDateString(), // Default time if not provided
    };
    setBlogs((prevBlogs) => [...prevBlogs, blogWithId]);
  };

  const updateBlog = (updatedBlog: Blog) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
    );
  };

  const deleteBlog = (id: string) => {
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
  };

  const contextValue = {
    blogs,
    addBlog,
    updateBlog,
    deleteBlog,
  };

  return (
    <BlogContext.Provider value={contextValue}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlogs must be used within a BlogProvider");
  }
  return context;
};

export default BlogProvider;
