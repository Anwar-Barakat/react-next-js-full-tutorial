'use client';
import React from "react";
import { motion } from "framer-motion";

const parentVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8,
    },
  },
};

const childVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StaggerChildren = () => {
  return (
    <div className="p-8 bg-[var(--muted)]/30 rounded-lg shadow-[var(--shadow-md)] flex flex-col items-center">
        <h3 className="text-xl font-bold text-white mb-4">Stagger Children</h3>
        <motion.div
            className="flex gap-4"
            variants={parentVariant}
            initial="hidden"
            animate="visible"
            >
            {[...Array(5)].map((_, index) => (
                <motion.div
                key={index}
                className="w-16 h-16 bg-blue-500 rounded"
                variants={childVariant}
                />
            ))}
        </motion.div>
    </div>
  );
};

export default StaggerChildren;
