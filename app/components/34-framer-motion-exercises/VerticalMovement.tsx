'use client';
import React from 'react';
import { motion } from 'framer-motion';

const VerticalMovement = () => {
  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Exercise 2: Vertical Movement</h3>
      <div className="w-full h-32 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
        <motion.div
          className="w-16 h-16 bg-accent rounded-full"
          initial={{ y: 0 }}
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default VerticalMovement;
