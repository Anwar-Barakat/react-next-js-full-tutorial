'use client';
import React from 'react';
import { motion } from 'framer-motion';

const PulsatingButton = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 2: Pulsating Effect</h3>
      <motion.button
        className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-lg"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Pulse Me!
      </motion.button>
    </div>
  );
};

export default PulsatingButton;
