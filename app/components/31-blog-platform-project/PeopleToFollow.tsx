"use client";

import React from 'react';

const PeopleToFollow = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 text-gray-900 dark:text-gray-50">
      <h3 className="text-lg font-semibold mb-3">Who to follow</h3>
      <ul className="space-y-2">
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-200 rounded-full mr-2"></div>
            <span>User One</span>
          </div>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">Follow</button>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-200 rounded-full mr-2"></div>
            <span>User Two</span>
          </div>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">Follow</button>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-200 rounded-full mr-2"></div>
            <span>User Three</span>
          </div>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">Follow</button>
        </li>
      </ul>
    </div>
  );
};

export default PeopleToFollow;
