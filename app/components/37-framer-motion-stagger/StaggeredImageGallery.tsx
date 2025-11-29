'use client';
import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const images = [
  "https://images.unsplash.com/photo-1507936580189-3816b4abf640?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448518340475-e3c680e9b4be?q=80&w=3200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490682143684-14369e18dce8?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1445964047600-cdbdb873673d?q=80&w=3870&auto=format&fit=crop",
];

const StaggeredImageGallery = () => {
  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 2: Staggered Image Gallery</h3>
      <motion.div
        className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`Gallery image ${index + 1}`}
            className="w-full h-24 object-cover rounded-md shadow-md"
            variants={itemVariants}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default StaggeredImageGallery;
