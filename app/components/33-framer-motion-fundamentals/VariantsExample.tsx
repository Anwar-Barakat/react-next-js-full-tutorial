'use client';
import React from "react";
import { motion } from "framer-motion";

const boxVariants = {
  initial: {
    scale: 1,
    rotate: 0,
    skew: 0,
  },
  hover: {
    scale: 1.2,
    rotate: 15,
    skew: 10,
    transition: { duration: 0.3 },
  },
  click: {
    scale: 0.9,
    rotate: -15,
    transition: { duration: 0.3 },
  },
};

const VariantsExample = () => {
  return (
    <div className="card flex flex-col items-center">
        <h3 className="text-xl font-bold text-white mb-4">Variants Example</h3>
        <div className="flex items-center justify-center h-40">
            <motion.div
                className="w-40 h-40 bg-blue-500"
                variants={boxVariants}
                initial={"initial"}
                whileHover={"hover"}
                whileTap={"click"}
            ></motion.div>
        </div>
    </div>
  );
};

export default VariantsExample;
