'use client';
import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const InteractiveCards = () => {
  const items = Array.from({ length: 4 }, (_, i) => `Card ${i + 1}`);

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Challenge 4: Interactive Cards</h3>
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700 rounded-lg">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="w-32 h-32 bg-gray-800 rounded-lg shadow-md flex items-center justify-center text-white font-bold cursor-pointer"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }} // Tailwind blue-500
            transition={{ duration: 0.2 }}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveCards;
