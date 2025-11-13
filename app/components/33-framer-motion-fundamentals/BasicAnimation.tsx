'use client';
import { motion } from 'framer-motion';
import React from 'react';

const BasicAnimation = () => {
  return (
    <div className="p-8 bg-muted/30 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-white mb-4">Basic Animation</h3>
      <div className="flex justify-center items-center h-32">
        <motion.div
          className="w-24 h-24 bg-blue-500 rounded-lg"
          animate={{
            scale: [1, 1.5, 1.5, 1, 1],
            rotate: [0, 0, 270, 270, 0],
            borderRadius: ["20%", "20%", "50%", "50%", "20%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      </div>
    </div>
  );
};

export default BasicAnimation;
