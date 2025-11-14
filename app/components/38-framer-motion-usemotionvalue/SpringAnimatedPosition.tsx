'use client';
import React from 'react';
import { motion, useMotionValue, spring } from 'framer-motion';

const SpringAnimatedPosition = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleClick = () => {
    x.set(Math.random() * 200 - 100);
    y.set(Math.random() * 200 - 100);
  };

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 3: Spring-Animated Position</h3>
      <div className="w-full h-48 flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden relative">
        <motion.div
          className="w-24 h-24 bg-yellow-500 rounded-lg cursor-pointer"
          style={{ x, y }}
          onClick={handleClick}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>
    </div>
  );
};

export default SpringAnimatedPosition;