'use client';
import React from 'react';
import { motion } from 'framer-motion';

const BasicTranslation = () => {
  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Exercise 1: Basic Translation</h3>
      <div className="w-full h-24 flex items-center justify-start bg-muted rounded-lg overflow-hidden">
        <motion.div
          className="w-16 h-16 bg-primary rounded-lg"
          initial={{ x: 0 }}
          animate={{ x: "calc(100% - 64px)" }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default BasicTranslation;
