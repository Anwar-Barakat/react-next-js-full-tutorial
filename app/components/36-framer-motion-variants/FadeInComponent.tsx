'use client';
import React from 'react';
import { motion } from 'framer-motion';

const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const FadeInComponent = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 1: Simple Fade-In</h3>
      <motion.div
        className="p-8 bg-primary text-foreground rounded-lg shadow-lg"
        variants={fadeInVariant}
        initial="hidden"
        animate="visible"
      >
        I fade in!
      </motion.div>
    </div>
  );
};

export default FadeInComponent;
