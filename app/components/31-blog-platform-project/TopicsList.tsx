"use client";

import React from 'react';

const TopicsList = () => {
  return (
    <div className="glass rounded-2xl shadow-lg p-5 text-foreground">
      <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-secondary to-accent rounded-full"></span>
        Topics to follow
      </h3>
      <ul className="space-y-3">
        <li className="p-3 rounded-xl hover:bg-muted transition-all duration-300 hover:shadow-[var(--shadow-sm)] cursor-pointer group border border-transparent hover:border-primary/20">
          <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-1">
            Frontend Development
          </p>
          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--secondary)] rounded-full"></span>
            Category
          </p>
        </li>
        <li className="p-3 rounded-xl hover:bg-muted transition-all duration-300 hover:shadow-[var(--shadow-sm)] cursor-pointer group border border-transparent hover:border-primary/20">
          <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-1">
            Backend Development
          </p>
          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--secondary)] rounded-full"></span>
            Category
          </p>
        </li>
        <li className="p-3 rounded-xl hover:bg-muted transition-all duration-300 hover:shadow-[var(--shadow-sm)] cursor-pointer group border border-transparent hover:border-primary/20">
          <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-1">
            DevOps
          </p>
          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--secondary)] rounded-full"></span>
            Category
          </p>
        </li>
      </ul>
    </div>
  );
};

export default TopicsList;
