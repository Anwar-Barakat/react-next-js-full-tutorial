"use client";

import React from 'react';

const TrendList = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 text-gray-900 dark:text-gray-50">
      <h3 className="text-lg font-semibold mb-3">Trends for you</h3>
      <ul className="space-y-2">
        <li>
          <p className="text-sm font-medium">#React19</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">10.5K posts</p>
        </li>
        <li>
          <p className="text-sm font-medium">#TypeScript</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">8.2K posts</p>
        </li>
        <li>
          <p className="text-sm font-medium">#WebDev</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">15K posts</p>
        </li>
      </ul>
    </div>
  );
};

export default TrendList;
