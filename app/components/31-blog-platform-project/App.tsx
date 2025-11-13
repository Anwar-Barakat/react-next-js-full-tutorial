"use client";

import React, { Suspense, useState } from "react";
import Navigation from "./Navigation";
import PeopleToFollow from "./PeopleToFollow";
import TrendList from "./TrendList";
import TopicsList from "./TopicsList";
import BlogProvider, { Blog } from "./BlogContext";
import Modal from "./Modal";
import BlogForm from "./BlogForm";
import ArticleList from "./ArticleList";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | undefined>(undefined);

  const openModalForNewBlog = () => {
    setEditingBlog(undefined); // Clear any existing blog data
    setIsModalOpen(true);
  };

  const openModalForEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(undefined); // Clear editing blog when modal closes
  };

  return (
    <BlogProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <Navigation />
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Content Area */}
          <main className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Blog Posts</h2>
              <button
                onClick={openModalForNewBlog}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add New Blog
              </button>
            </div>
            <Suspense fallback={<div>Loading articles...</div>}>
              <ArticleList onEdit={openModalForEditBlog} />
            </Suspense>
          </main>

          {/* Sidebar */}
          <aside className="md:col-span-1">
            <PeopleToFollow />
            <TrendList />
            <TopicsList />
          </aside>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBlog ? "Edit Blog" : "Add New Blog"}>
          <BlogForm existingBlog={editingBlog} onClose={closeModal} />
        </Modal>
      </div>
    </BlogProvider>
  );
};

export default App;
