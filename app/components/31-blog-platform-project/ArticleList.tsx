"use client";

import React, { FC } from "react";
import { useBlogs, Blog } from "./BlogContext";
import ArticleCard from "./ArticleCard";

interface ArticleListProps {
  onEdit: (blog: Blog) => void;
}

const ArticleList: FC<ArticleListProps> = ({ onEdit }) => {
  const { blogs, deleteBlog } = useBlogs();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {blogs.length === 0 ? (
        <p className="col-span-full text-center text-gray-600 dark:text-gray-400 text-lg">
          No blog posts yet. Add one to get started!
        </p>
      ) : (
        blogs.map((blog) => (
          <ArticleCard
            key={blog.id}
            blog={blog}
            onDelete={deleteBlog}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
};

export default ArticleList;
