'use client';
import React from 'react';
import { motion, easeInOut } from 'framer-motion';

const waveVariants = {
  animate: (i: number) => ({
    y: [0, -20, 0],
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      repeat: Infinity,
      ease: easeInOut,
    },
  }),
};

const WaveEffect = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 6: Wave Effect</h3>
      <div className="w-full h-32 flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden">
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-8 h-8 bg-blue-400 rounded-md"
              variants={waveVariants}
              custom={i}
              animate="animate"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaveEffect;
