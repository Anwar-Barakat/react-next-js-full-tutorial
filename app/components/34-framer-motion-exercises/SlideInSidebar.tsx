'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SlideInSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass flex flex-col items-center relative overflow-hidden">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 6: Slide In Sidebar</h3>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn bg-primary mb-4"
      >
        Toggle Sidebar
      </button>
      <div className="w-full h-48 bg-muted rounded-lg relative overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 h-full w-2/3 bg-primary p-4 text-foreground flex items-center justify-center"
            >
              Sidebar Content
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SlideInSidebar;
