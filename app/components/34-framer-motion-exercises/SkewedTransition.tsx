'use client';
import React from 'react';
import { motion } from 'framer-motion';

const SkewedTransition = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 4: Skewed Transition</h3>
      <div className="w-full h-32 flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden">
        <motion.div
          className="w-32 h-20 bg-yellow-500 rounded-lg cursor-pointer"
          whileTap={{ skewX: 20, skewY: 10 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default SkewedTransition;
