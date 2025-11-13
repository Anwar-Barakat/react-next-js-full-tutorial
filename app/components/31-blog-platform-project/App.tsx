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
      <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--muted)]/30 to-[var(--background)] text-[var(--foreground)]">
        <Navigation />
        <div className="container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <main className="md:col-span-2 bg-[var(--card)] rounded-2xl shadow-[var(--shadow-lg)] p-6 md:p-8 border border-[var(--border)] backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold heading-gradient">
                Blog Posts
              </h2>
              <button
                onClick={openModalForNewBlog}
                className="btn btn-primary"
              >
                + Add New Blog
              </button>
            </div>
            <Suspense fallback={
              <div className="center-content py-12">
                <div className="text-[var(--muted-foreground)] text-lg animate-pulse">Loading articles...</div>
              </div>
            }>
              <ArticleList onEdit={openModalForEditBlog} />
            </Suspense>
          </main>

          {/* Sidebar */}
          <aside className="md:col-span-1 space-y-4">
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
