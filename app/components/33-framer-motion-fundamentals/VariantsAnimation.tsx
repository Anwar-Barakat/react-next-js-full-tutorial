'use client';
import { motion } from 'framer-motion';
import React from 'react';

const VariantsAnimation = () => {
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Variants Animation</h3>
      <motion.ul
        className="flex justify-center items-center h-32 space-x-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {[0, 1, 2, 3].map((index) => (
          <motion.li
            key={index}
            className="w-12 h-12 bg-[var(--warning)]/50 rounded-full"
            variants={item}
          />
        ))}
      </motion.ul>
    </div>
  );
};

export default VariantsAnimation;
