'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const images = [
  "https://images.unsplash.com/photo-1507936580189-3816b4abf640?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448518340475-e3c680e9b4be?q=80&w=3200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490682143684-14369e18dce8?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1445964047600-cdbdb873673d?q=80&w=3870&auto=format&fit=crop",
];

const FullPageScrollGallery = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll(); // Global scroll progress for the bar

  // Scroll progress for the horizontal gallery section
  const { scrollYProgress: galleryScrollProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"], // When gallery enters/leaves viewport
  });

  // Transform global scroll progress (0-1) to percentage for the fixed progress bar
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const smoothWidth = useSpring(lineWidth, {
    stiffness: 100,
    damping: 20,
  });

  // Transform gallery scroll progress to horizontal movement
  // The total width of the images + gaps, minus the viewport width
  // Assuming each image is w-80 (320px) and gap-4 (16px)
  // (5 images * 320px) + (4 gaps * 16px) = 1600 + 64 = 1664px
  // If viewport is, say, 1000px, then we need to scroll 664px
  // This calculation needs to be dynamic or estimated. For now, let's estimate.
  // Let's say we want to scroll 3 images width, so 3 * (320 + 16) = 1008px
  const xTransform = useTransform(galleryScrollProgress, [0, 1], ["0%", "-60%"]); // Adjust -60% based on content width

  return (
    <div className="bg-gray-900 text-white min-h-[300vh] relative">
      {/* Fixed Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-2 bg-blue-500 z-50"
        style={{ width: smoothWidth }}
      />

      {/* Intro Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <h1 className="text-5xl md:text-7xl font-extrabold heading-gradient">
          Scroll Down for Magic
        </h1>
      </section>

      {/* Horizontal Scroll Gallery Section */}
      <section ref={galleryRef} className="h-[150vh] flex items-center justify-start sticky top-0 overflow-hidden">
        <motion.div style={{ x: xTransform }} className="flex gap-8 p-8">
          {images.map((image, index) => (
            <div
              key={index}
              className="w-[500px] h-[400px] flex-shrink-0 rounded-lg shadow-xl overflow-hidden"
            >
              <img src={image} alt={`Gallery Image ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Outro Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <h2 className="text-4xl md:text-6xl font-bold heading-gradient">
          End of the Journey
        </h2>
      </section>
    </div>
  );
};

export default FullPageScrollGallery;
