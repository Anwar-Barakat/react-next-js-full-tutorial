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

const StaggeredButtonPress = () => {
  const buttons = ['Button 1', 'Button 2', 'Button 3'];

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 3: Staggered Button Press</h3>
      <motion.div
        className="flex space-x-4 p-4 bg-gray-700 rounded-lg"
        variants={containerVariants}
        initial="hidden"
        whileHover="visible"
      >
        {buttons.map((label, index) => (
          <motion.button
            key={index}
            className="btn btn-primary"
            variants={itemVariants}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default StaggeredButtonPress;
