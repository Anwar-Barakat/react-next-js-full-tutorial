'use client';
import React from 'react';
import { motion } from 'framer-motion';

const PulsatingButton = () => {
  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 2: Pulsating Effect</h3>
      <motion.button
        className="btn bg-[var(--secondary)]/50"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Pulse Me!
      </motion.button>
    </div>
  );
};

export default PulsatingButton;
