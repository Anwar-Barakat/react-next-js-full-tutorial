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
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const StaggeredGridLayout = () => {
  const items = Array.from({ length: 9 }, (_, i) => `Grid Item ${i + 1}`);

  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 4: Staggered Grid Layout</h3>
      <motion.div
        className="grid grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="w-24 h-24 bg-accent/50 rounded-md flex items-center justify-center text-foreground text-sm"
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
