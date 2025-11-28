'use client';
import React from 'react';
import { motion } from 'framer-motion';

const RotationAnimation = () => {
  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Exercise 3: Rotation Animation</h3>
      <div className="w-full h-32 flex items-center justify-center bg-[var(--muted)]/50 rounded-lg overflow-hidden">
        <motion.div
          className="w-16 h-16 bg-[var(--secondary)]/50 rounded-full flex items-center justify-center text-[var(--foreground)] text-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          ⚙️
        </motion.div>
      </div>
    </div>
  );
};

export default RotationAnimation;
