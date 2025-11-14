'use client';
import React from 'react';
import { motion, useMotionValue } from 'framer-motion';

const HoverLinkedScale = () => {
  const scale = useMotionValue(1);

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 2: Hover-Linked Scale</h3>
      <motion.button
        className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg"
        style={{ scale }}
        onHoverStart={() => scale.set(1.2)}
        onHoverEnd={() => scale.set(1)}
      >
        Hover Me!
      </motion.button>
    </div>
  );
};

export default HoverLinkedScale;
