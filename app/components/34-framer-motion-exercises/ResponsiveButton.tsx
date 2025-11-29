'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ResponsiveButton = () => {
  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Exercise 8: Responsive Button</h3>
      <motion.button
        className="btn bg-primary text-base md:text-lg lg:text-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Click Me!
      </motion.button>
    </div>
  );
};

export default ResponsiveButton;
