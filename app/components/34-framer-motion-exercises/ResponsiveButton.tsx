'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ResponsiveButton = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 8: Responsive Button</h3>
      <motion.button
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg
                   text-base md:text-lg lg:text-xl
                   hover:bg-blue-600 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Click Me!
      </motion.button>
    </div>
  );
};

export default ResponsiveButton;
