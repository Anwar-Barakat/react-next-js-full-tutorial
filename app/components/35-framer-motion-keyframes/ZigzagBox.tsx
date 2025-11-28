'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ZigzagBox = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 5: Zigzag Animation</h3>
      <div className="w-full h-32 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
                  <motion.div
                    className="w-16 h-16 bg-warning rounded-lg"          animate={{ x: [0, 100, 0, -100, 0], y: [0, 50, 100, 50, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default ZigzagBox;
