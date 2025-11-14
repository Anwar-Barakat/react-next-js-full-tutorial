'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ColorChangeSquare = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 3: Color Change Animation</h3>
      <div className="w-full h-32 flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden">
        <motion.div
          className="w-24 h-24 rounded-lg"
          animate={{ backgroundColor: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
};

export default ColorChangeSquare;
