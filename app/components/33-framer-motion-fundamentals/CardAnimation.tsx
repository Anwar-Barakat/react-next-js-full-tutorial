'use client';
import React from "react";
import { motion } from "framer-motion";

const CardAnimation = () => {
  return (
    <div className="glass flex flex-col items-center">
        <h3 className="text-xl font-bold text-foreground mb-4">Card Animation</h3>
        <motion.div
            className="max-w-sm glass rounded-lg shadow-lg cursor-pointer overflow-hidden"
            initial={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            drag
            dragConstraints={{ left: -50, right: 50, bottom: 50, top: -50 }}
            dragElastic={0.2}
            transition={{ type: "spring", stiffness: 300 }}
            >
            <img
                src="https://placehold.co/600x400"
                alt="Card Image"
                className="w-full h-48 object-cover"
            />

            <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">Card title</h2>
                <p className="text-muted-foreground mb-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores,
                perspiciatis.
                </p>
                <button className="btn btn-accent">
                Learn more
                </button>
            </div>
        </motion.div>
    </div>
  );
};

export default CardAnimation;
