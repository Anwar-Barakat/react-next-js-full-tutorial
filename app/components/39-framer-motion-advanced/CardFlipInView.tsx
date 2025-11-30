'use client';
import React from 'react';
import { motion } from 'framer-motion';

const cardFlipVariants = {
  hidden: { rotateY: 0 },
  visible: { rotateY: 180, transition: { duration: 0.8 } },
};

const CardFlipInView = () => {
  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Challenge 2: Card Flip Animation</h3>
      <div className="perspective-[1000px] w-64 h-40">
        <motion.div
          className="relative w-full h-full rounded-lg shadow-lg [transform-style:preserve-3d]"
          variants={cardFlipVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-secondary flex items-center justify-center text-xl font-bold [backface-visibility:hidden] rounded-lg">
            Front
          </div>

          <div className="absolute inset-0 bg-primary flex items-center justify-center text-xl font-bold text-foreground [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-lg">
            Back
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CardFlipInView;