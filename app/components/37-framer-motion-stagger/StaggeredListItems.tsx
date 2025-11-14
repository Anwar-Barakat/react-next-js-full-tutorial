'use client';
import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StaggeredListItems = () => {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 1: Staggered List Items</h3>
      <motion.div
        className="w-full max-w-xs bg-gray-700 rounded-lg p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 p-3 mb-2 rounded-md text-white"
            variants={itemVariants}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default StaggeredListItems;
