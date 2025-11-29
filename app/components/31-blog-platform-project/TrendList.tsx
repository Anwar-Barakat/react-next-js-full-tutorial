"use client";

import React from 'react';

const TrendList = () => {
  return (
    <div className="glass rounded-2xl shadow-lg p-5 mb-4 text-foreground">
      <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-accent to-primary rounded-full"></span>
        Trends for you
      </h3>
      <ul className="space-y-3">
        <li className="p-3 rounded-xl hover:bg-muted transition-all duration-300 hover:shadow-[var(--shadow-sm)] cursor-pointer group">
          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">
            #React19
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            10.5K posts
          </p>
        </li>
        <li className="p-3 rounded-xl hover:bg-muted transition-all duration-300 hover:shadow-[var(--shadow-sm)] cursor-pointer group">
          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">
            #TypeScript
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            8.2K posts
          </p>
        </li>
        <li className="p-3 rounded-xl hover:bg-muted transition-all duration-300 hover:shadow-[var(--shadow-sm)] cursor-pointer group">
          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">
            #WebDev
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            15K posts
          </p>
        </li>
      </ul>
    </div>
  );
};

export default TrendList;
