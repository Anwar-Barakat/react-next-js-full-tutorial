'use client';
import React from 'react';
import { motion, useMotionValue } from 'framer-motion';

const DynamicRotation = () => {
  const rotate = useMotionValue(0);

  const handleClick = () => {
    rotate.set(rotate.get() + 90);
  };

  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 4: Dynamic Rotation</h3>
      <div className="w-full h-32 flex items-center justify-center bg-muted/50 rounded-lg overflow-hidden">
        <motion.div
          className="w-24 h-24 bg-secondary/50 rounded-lg"
          style={{ rotate }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        />
      </div>
      <button
        onClick={handleClick}
        className="btn bg-primary/50 text-foreground"
      >
        Rotate
      </button>
    </div>
  );
};

export default DynamicRotation;