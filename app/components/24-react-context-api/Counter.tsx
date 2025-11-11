'use client';
import React from "react";
import { useMyContext } from "./MyContext";

export const Counter: React.FC = () => {
  const { count, increment, decrement } = useMyContext();

  return (
    <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md dark:bg-gray-800 text-gray-800 dark:text-white text-center">
      <h3 className="text-xl font-semibold mb-4">Context Counter</h3>
      <p className="text-5xl font-bold mb-4">{count}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={increment}
          className="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Increment
        </button>
        <button
          onClick={decrement}
          className="px-6 py-3 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          Decrement
        </button>
      </div>
    </div>
  );
};
