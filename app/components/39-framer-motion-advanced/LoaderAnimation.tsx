'use client';
import React from "react";
import { motion } from "framer-motion";

const LoaderAnimation = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Loader Animation</h3>
      <div className="w-full h-32 flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden">
        <motion.div
          className="relative w-16 h-16 rounded-full border-4 border-t-4 border-blue-600 border-solid"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          role="status"
          aria-label="Loading"
        >
          {/* Inner animated glow for effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-300 border-solid border-t-transparent"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          ></motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoaderAnimation;
