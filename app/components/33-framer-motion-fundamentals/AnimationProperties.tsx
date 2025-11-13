'use client';
import { motion } from 'framer-motion';
import React from 'react';

const AnimationProperties = () => {
  return (
    <div className="p-8 bg-[var(--muted)]/30 rounded-lg shadow-[var(--shadow-md)]">
      <h3 className="text-xl font-bold text-white mb-4">Animation Properties</h3>
      <div className="flex justify-around items-center h-32">
        <motion.div
          className="w-16 h-16 bg-green-500 rounded-lg"
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.8, rotate: -90, borderRadius: "100%" }}
        />
        <motion.div
          className="w-16 h-16 bg-red-500 rounded-lg"
          drag
          dragConstraints={{
            top: -50,
            left: -50,
            right: 50,
            bottom: 50,
          }}
        />
        <motion.div
          className="w-16 h-16 bg-purple-500 rounded-lg"
          animate={{
            x: [0, 100, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default AnimationProperties;
