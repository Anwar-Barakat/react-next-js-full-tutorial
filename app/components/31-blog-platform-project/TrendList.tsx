"use client";

import React from 'react';

const TrendList = () => {
  return (
    <div className="bg-gradient-to-br from-[var(--card)] to-[var(--muted)]/30 rounded-2xl shadow-[var(--shadow-lg)] p-5 mb-4 text-[var(--foreground)] border border-[var(--border)] backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-4 text-[var(--foreground)] flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-[var(--accent)] to-[var(--primary)] rounded-full"></span>
        Trends for you
      </h3>
      <ul className="space-y-3">
        <li className="p-3 rounded-xl hover:bg-[var(--muted)]/50 transition-all duration-300 hover:shadow-[var(--shadow-sm)] cursor-pointer group">
          <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-1">
            #React19
          </p>
          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"></span>
            10.5K posts
          </p>
        </li>
        <li className="p-3 rounded-xl hover:bg-[var(--muted)]/50 transition-all duration-300 hover:shadow-[var(--shadow-sm)] cursor-pointer group">
          <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-1">
            #TypeScript
          </p>
          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"></span>
            8.2K posts
          </p>
        </li>
        <li className="p-3 rounded-xl hover:bg-[var(--muted)]/50 transition-all duration-300 hover:shadow-[var(--shadow-sm)] cursor-pointer group">
          <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-1">
            #WebDev
          </p>
          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"></span>
            15K posts
          </p>
        </li>
      </ul>
    </div>
  );
};

export default TrendList;
