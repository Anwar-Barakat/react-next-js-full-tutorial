"use client";

import React, { FC } from "react";
import { Blog } from "./BlogContext";

interface ArticleCardProps {
  blog: Blog;
  onDelete: (id: string) => void;
  onEdit: (blog: Blog) => void;
}

const ArticleCard: FC<ArticleCardProps> = ({ blog, onDelete, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
          {blog.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-grow">
          {blog.description}
        </p>
        {blog.time && (
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            Published: {blog.time}
          </p>
        )}
      </div>
      <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onEdit(blog)}
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(blog.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
