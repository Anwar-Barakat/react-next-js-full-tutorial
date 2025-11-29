'use client';
import React from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      when: "beforeChildren",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, rotate: -10, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const ComplexTimeline = () => {
  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Challenge 3: Complex Timeline Animation</h3>
      <motion.div
        className="w-full max-w-sm p-4 bg-muted/50 rounded-lg flex flex-col items-center space-y-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="w-24 h-24 bg-primary/50 rounded-lg flex items-center justify-center text-foreground font-bold"
          variants={itemVariants}
        >
          Step 1
        </motion.div>
        <motion.div
          className="w-24 h-24 bg-accent/50 rounded-lg flex items-center justify-center text-foreground font-bold"
          variants={itemVariants}
        >
          Step 2
        </motion.div>
        <motion.div
          className="w-24 h-24 bg-secondary/50 rounded-lg flex items-center justify-center text-foreground font-bold"
          variants={itemVariants}
        >
          Step 3
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComplexTimeline;
