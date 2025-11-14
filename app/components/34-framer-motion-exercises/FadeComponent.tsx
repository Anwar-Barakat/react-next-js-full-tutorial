'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FadeComponent = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 5: Simple Fade In/Out</h3>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
              className="p-4 bg-teal-500 text-white rounded-lg"
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
