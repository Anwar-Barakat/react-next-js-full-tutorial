'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";

const galleryImages = [
  "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
  "https://images.unsplash.com/photo-1490682143684-14369e18dce8",
  "https://images.unsplash.com/photo-1445964047600-cdbdb873673d",
];

const parentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.2, // shorter stagger for smoother appearance
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const GalleryAnimation = () => {
  const [showImages, setShowImages] = useState(false);

  return (
    <div className="glass flex flex-col items-center">
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Gallery Animation</h3>
        <button
            onClick={() => setShowImages((prev) => !prev)}
            className="btn bg-[var(--warning)]/50 mb-4"
        >
            {showImages ? "Hide Images" : "Show Images"}
        </button>

        <motion.div
            className="flex flex-wrap gap-4 justify-center"
            variants={parentVariants}
            initial="hidden"
            animate={showImages ? "visible" : "hidden"}
        >
            {galleryImages.map((image, index) => (
            <motion.img
                key={index}
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-32 h-24 object-cover rounded shadow"
                variants={childVariants}
            />
            ))}
        </motion.div>
    </div>
  );
};

export default GalleryAnimation;
