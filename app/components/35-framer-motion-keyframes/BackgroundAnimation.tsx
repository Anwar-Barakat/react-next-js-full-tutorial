'use client';
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 7: Background Animation</h3>
      <div className="w-full h-32 flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden relative">
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <p className="relative z-10 text-white text-lg font-bold">Animated Background</p>
      </div>
    </div>
  );
};

export default BackgroundAnimation;
