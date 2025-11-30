'use client';
import React from "react";
import { motion } from "framer-motion";

const DragAnimation = () => {
  return (
    <div className="glass flex flex-col items-center">
        <h3 className="text-xl font-bold text-foreground mb-4">Drag Animation</h3>
        <div className="w-64 h-64 bg-muted rounded-lg flex justify-center items-center">
            <motion.div
                className="w-32 h-32 bg-primary rounded-lg flex justify-center items-center text-foreground font-bold"
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
