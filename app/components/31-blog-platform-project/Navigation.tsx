"use client";

import React from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";

const Navigation = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      {/* Left section: Search input */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
        <FaSearch className="text-gray-500 dark:text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 w-48"
        />
      </div>

      {/* Right section: User profile */}
      <section className="flex items-center">
        <FaUserCircle className="text-gray-500 dark:text-gray-400 text-3xl cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
      </section>
    </nav>
  );
};

export default Navigation;
