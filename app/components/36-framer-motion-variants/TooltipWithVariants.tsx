'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tooltipVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const TooltipWithVariants = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="card flex flex-col items-center relative">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 3: Tooltip with Variants</h3>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="relative px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer"
      >
        Hover over me
        <AnimatePresence>
          {isVisible && (
            <motion.div
              variants={tooltipVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black text-white text-sm rounded-md whitespace-nowrap"
            >
              I&apos;m a tooltip!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TooltipWithVariants;
