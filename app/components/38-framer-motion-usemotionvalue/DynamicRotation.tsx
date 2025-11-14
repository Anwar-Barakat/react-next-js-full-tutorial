'use client';
import React from 'react';
import { motion, useMotionValue } from 'framer-motion';

const DynamicRotation = () => {
  const rotate = useMotionValue(0);

  const handleClick = () => {
    rotate.set(rotate.get() + 90); // Rotate by 90 degrees on each click
  };

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 4: Dynamic Rotation</h3>
      <div className="w-full h-32 flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden">
        <motion.div
          className="w-24 h-24 bg-purple-500 rounded-lg"
          style={{ rotate }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        />
      </div>
      <button
        onClick={handleClick}
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Rotate
      </button>
    </div>
  );
};

export default DynamicRotation;
