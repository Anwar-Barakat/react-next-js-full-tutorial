"use client";

import React from 'react';

const TopicsList = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-gray-900 dark:text-gray-50">
      <h3 className="text-lg font-semibold mb-3">Topics to follow</h3>
      <ul className="space-y-2">
        <li>
          <p className="text-sm font-medium">Frontend Development</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
        </li>
        <li>
          <p className="text-sm font-medium">Backend Development</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
        </li>
        <li>
          <p className="text-sm font-medium">DevOps</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
        </li>
      </ul>
    </div>
  );
};

export default TopicsList;
