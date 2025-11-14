'use client';
import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
};

const StaggeredGridLayout = () => {
  const items = Array.from({ length: 9 }, (_, i) => `Grid Item ${i + 1}`);

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 4: Staggered Grid Layout</h3>
      <motion.div
        className="grid grid-cols-3 gap-4 p-4 bg-gray-700 rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="w-20 h-20 bg-teal-500 rounded-md flex items-center justify-center text-white text-sm"
            variants={itemVariants}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default StaggeredGridLayout;
