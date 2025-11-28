'use client';
import React from 'react';
import { motion } from 'framer-motion';

const SlidingText = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 4: Sliding Text</h3>
      <div className="w-full h-32 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
        <motion.p
          className="text-3xl font-bold text-foreground"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 1,
          }}
        >
          Sliding Text!
        </motion.p>
      </div>
    </div>
  );
};

export default SlidingText;
