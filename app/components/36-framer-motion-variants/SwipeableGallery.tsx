'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1507936580189-3816b4abf640?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448518340475-e3c680e9b4be?q=80&w=3200&auto=format&fit=crop",
];

const swipeConfidenceThreshold = 100; // pixels

const SwipeableGallery = () => {
  const [index, setIndex] = useState(0);

  const handleSwipe = (_: any, info: any) => {
    if (info.offset.y < -swipeConfidenceThreshold) {
      setIndex((prev) => (prev + 1) % images.length);
    } else if (info.offset.y > swipeConfidenceThreshold) {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Swipeable Image Gallery</h3>
      <div className="relative w-[300px] h-[450px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            className="absolute w-full h-full object-cover rounded-2xl"
            drag="y"
            dragElastic={0.6}
            onDragEnd={handleSwipe}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwipeableGallery;
