"use client";

import React from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";

const Navigation = () => {
  return (
    <nav className="bg-[var(--card)]/95 backdrop-blur-md shadow-[var(--shadow-lg)] p-4 md:p-6 flex justify-between items-center border-b border-[var(--border)] sticky top-0 z-40">
      <div className="flex items-center bg-gradient-to-r from-[var(--muted)] to-[var(--muted)]/80 rounded-full px-5 py-3 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300">
        <FaSearch className="text-[var(--muted-foreground)] mr-3" />
        <input
          type="text"
          placeholder="Search blogs..."
          className="bg-transparent outline-none text-[var(--foreground)] placeholder-[var(--muted-foreground)] w-48 md:w-64 focus:ring-2 focus:ring-[var(--primary)]/50 rounded-full transition-all"
        />
      </div>

      <section className="flex items-center">
        <div className="relative group">
          <FaUserCircle className="text-[var(--muted-foreground)] text-3xl cursor-pointer hover:text-[var(--primary)] transition-all duration-300 hover:scale-110" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--accent)] rounded-full border-2 border-[var(--card)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </section>
    </nav>
  );
};

export default Navigation;