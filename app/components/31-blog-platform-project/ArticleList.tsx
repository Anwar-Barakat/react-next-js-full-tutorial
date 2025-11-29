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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {blogs.length === 0 ? (
        <div className="col-span-full center-content py-16">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <p className="text-[var(--muted-foreground)] text-lg font-medium">
              No blog posts yet. Add one to get started!
            </p>
          </div>
        </div>
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
