'use client';
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1507936580189-3816b4abf640?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=3870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448518340475-e3c680e9b4be?q=80&w=3200&auto=format&fit=crop",
];

const HorizontalScrollGallery = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);

  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Horizontal Scroll Gallery</h3>
      <div className="w-full h-64 bg-muted/50 rounded-lg overflow-hidden">
        <div className="relative h-[300px]" ref={targetRef}>
          <div className="sticky top-0 overflow-hidden">
            <motion.div className="flex gap-4 p-4" style={{ x }}>
              {images.map((image, index) => (
                <div
                  key={index}
                  className="w-80 h-64 rounded-lg shadow-lg flex-shrink-0 bg-card/50"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollGallery;