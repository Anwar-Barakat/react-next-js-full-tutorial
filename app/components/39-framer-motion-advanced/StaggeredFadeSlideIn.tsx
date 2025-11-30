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
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const StaggeredFadeSlideIn = () => {
  const items = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'];

  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Challenge 1: Staggered Fade and Slide In</h3>
      <motion.ul
        className="w-full max-w-xs bg-muted rounded-lg p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.li
            key={index}
            className="bg-card p-3 mb-2 rounded-md text-foreground"
            variants={itemVariants}
          >
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default StaggeredFadeSlideIn;