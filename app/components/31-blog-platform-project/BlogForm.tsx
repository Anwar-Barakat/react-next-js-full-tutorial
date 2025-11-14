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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input h-28 resize-none"
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
          Image URL
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
          Date <span className="text-[var(--muted-foreground)] font-normal">(Optional)</span>
        </label>
        <input
          type="date"
          id="time"
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {existingBlog ? "Update Blog" : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
