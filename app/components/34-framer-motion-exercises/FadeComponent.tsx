'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FadeComponent = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Exercise 5: Simple Fade In/Out</h3>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="btn bg-[var(--primary)]/50 mb-4"
      >
        Toggle Fade Component
      </button>
      <div className="w-full h-32 flex items-center justify-center">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-[var(--accent)]/50 text-[var(--foreground)] rounded-lg"
            >
              I fade in and out!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FadeComponent;
