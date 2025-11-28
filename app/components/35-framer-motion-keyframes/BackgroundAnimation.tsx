'use client';
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 7: Background Animation</h3>
      <div className="w-full h-32 flex items-center justify-center bg-[var(--muted)]/50 rounded-lg overflow-hidden relative">
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: ["#8b5cf6", "#f59e0b", "#f59e0b", "#06b6d4", "#3b82f6", "#8b5cf6"] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <p className="relative z-10 text-foreground text-lg font-bold">Animated Background</p>
      </div>
    </div>
  );
};

export default BackgroundAnimation;
