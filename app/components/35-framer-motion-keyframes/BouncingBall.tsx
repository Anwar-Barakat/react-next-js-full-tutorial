'use client';
import React from 'react';
import { motion } from 'framer-motion';

const BouncingBall = () => {
  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Exercise 1: Bouncing Ball</h3>
      <div className="w-full h-32 flex items-center justify-center bg-[var(--muted)]/50 rounded-lg overflow-hidden">
        <motion.div
          className="w-12 h-12 bg-[var(--secondary)]/50 rounded-full"
          animate={{ y: [0, 50, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeOut",
            times: [0, 0.5, 1],
          }}
        />
      </div>
    </div>
  );
};

export default BouncingBall;
