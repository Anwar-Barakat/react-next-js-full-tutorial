"use client";

import React from 'react';

const PeopleToFollow = () => {
  return (
    <div className="bg-gradient-to-br from-[var(--card)] to-[var(--muted)]/30 rounded-2xl shadow-[var(--shadow-lg)] p-5 mb-4 text-[var(--foreground)] border border-[var(--border)] backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-4 text-[var(--foreground)] flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-[var(--primary)] to-[var(--accent)] rounded-full"></span>
        Who to follow
      </h3>
      <ul className="space-y-3">
        <li className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--muted)]/50 transition-all duration-300 hover:shadow-[var(--shadow-sm)] group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)]/30 to-[var(--primary)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-[var(--primary)] font-bold">U1</span>
            </div>
            <span className="text-[var(--foreground)] font-medium">User One</span>
          </div>
          <button className="btn btn-primary btn-sm rounded-full">
            Follow
          </button>
        </li>
        <li className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--muted)]/50 transition-all duration-300 hover:shadow-[var(--shadow-sm)] group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-[var(--accent)] font-bold">U2</span>
            </div>
            <span className="text-[var(--foreground)] font-medium">User Two</span>
          </div>
          <button className="btn btn-primary btn-sm rounded-full">
            Follow
          </button>
        </li>
        <li className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--muted)]/50 transition-all duration-300 hover:shadow-[var(--shadow-sm)] group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--secondary)]/30 to-[var(--secondary)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-[var(--secondary)] font-bold">U3</span>
            </div>
            <span className="text-[var(--foreground)] font-medium">User Three</span>
          </div>
          <button className="btn btn-primary btn-sm rounded-full">
            Follow
          </button>
        </li>
      </ul>
    </div>
  );
};

export default PeopleToFollow;
