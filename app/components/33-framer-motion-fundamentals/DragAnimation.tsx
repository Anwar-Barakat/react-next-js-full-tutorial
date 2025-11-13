'use client';
import React from "react";
import { motion } from "framer-motion";

const DragAnimation = () => {
  return (
    <div className="p-8 bg-muted/30 rounded-lg shadow-md flex flex-col items-center">
        <h3 className="text-xl font-bold text-white mb-4">Drag Animation</h3>
        <div className="w-64 h-64 bg-gray-800 rounded-lg flex justify-center items-center">
            <motion.div
                className="w-32 h-32 bg-indigo-500 rounded-lg flex justify-center items-center text-white font-bold"
                drag
                dragConstraints={{
                    top: -50,
                    left: -50,
                    right: 50,
                    bottom: 50,
                }}
            >
                Drag me
            </motion.div>
        </div>
    </div>
  );
};

export default DragAnimation;
