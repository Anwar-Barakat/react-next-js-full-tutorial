'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ColorChangeSquare = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 3: Color Change Animation</h3>
      <div className="w-full h-32 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
        <motion.div
          className="w-24 h-24 rounded-lg"
          animate={{ backgroundColor: ["#8b5cf6", "#f59e0b", "#f59e0b", "#06b6d4", "#3b82f6", "#8b5cf6"] }}
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
