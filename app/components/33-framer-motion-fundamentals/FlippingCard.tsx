'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";

const cardVariants = {
  front: { rotateY: 0 },
  back: { rotateY: 180 },
};

const FlippingCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="glass flex flex-col items-center">
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Flipping Card</h3>
        <div
            className="perspective-[1000px]"
            onClick={() => setIsFlipped((prev) => !prev)}
            >
            <motion.div
                variants={cardVariants}
                initial="front"
                animate={isFlipped ? "back" : "front"}
                transition={{ duration: 0.6 }}
                className="relative w-64 h-40 rounded-lg shadow-lg [transform-style:preserve-3d]"
            >
                {/* Front side */}
                <div className="absolute inset-0 bg-[var(--secondary)]/50 flex items-center justify-center text-xl font-bold [backface-visibility:hidden] rounded-lg">
                Front side
                </div>

                {/* Back side */}
                <div className="absolute inset-0 bg-[var(--primary)]/50 flex items-center justify-center text-xl font-bold text-[var(--foreground)] [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-lg">
                Back side
                </div>
            </motion.div>
        </div>
    </div>
  );
};

export default FlippingCard;
