'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const menuVariants = {
  closed: { x: '-100%' },
  open: { x: 0 },
};

const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass flex flex-col items-center relative overflow-hidden">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 2: Navigation Menu</h3>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 mb-4 bg-primary text-foreground rounded hover:bg-primary-hover transition-colors"
      >
        Toggle Menu
      </button>
      <div className="w-full h-48 bg-muted rounded-lg relative overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 h-full w-2/3 bg-accent p-4 text-foreground flex flex-col justify-center items-center"
            >
              <p className="text-lg font-bold">Menu Item 1</p>
              <p className="text-lg font-bold">Menu Item 2</p>
              <p className="text-lg font-bold">Menu Item 3</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NavigationMenu;
