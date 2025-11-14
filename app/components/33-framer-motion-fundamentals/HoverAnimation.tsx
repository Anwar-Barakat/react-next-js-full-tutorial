'use client';
import React from "react";
import { motion } from "framer-motion";

const HoverAnimation = () => {
  return (
    <div className="card flex flex-col items-center">
        <h3 className="text-xl font-bold text-white mb-4">Hover Animation</h3>
        <div className="flex justify-center items-center h-32">
            <motion.div
                className="bg-gray-800 w-16 h-16 rounded-lg"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 300 }}
            ></motion.div>
        </div>
    </div>
  );
};

export default HoverAnimation;
