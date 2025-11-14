'use client';
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();

  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const smoothWidth = useSpring(lineWidth, {
    stiffness: 100,
    damping: 20,
  });

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Scroll Progress Bar</h3>
      <div className="w-full h-32 relative bg-gray-700 rounded-lg overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-2 bg-red-500 z-50"
          style={{ width: smoothWidth }}
        />

        <div className="h-[200px] p-2 space-y-1 overflow-y-scroll">
          {[...Array(20)].map((_, index) => (
            <p key={index} className="text-gray-300 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim iste a
              voluptate corporis nobis ducimus, earum exercitationem corrupti
              porro aliquam!
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;