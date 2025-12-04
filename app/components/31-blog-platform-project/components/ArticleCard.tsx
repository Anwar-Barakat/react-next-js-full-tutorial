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
    <div className="group glass overflow-hidden flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {blog.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
          {blog.description}
        </p>
        {blog.time && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span className="w-1 h-1 bg-accent rounded-full"></span>
            <span>Published: {blog.time}</span>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 p-4 border-t border-border bg-muted">
        <button
          onClick={() => onEdit(blog)}
          className="btn btn-primary btn-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(blog.id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
