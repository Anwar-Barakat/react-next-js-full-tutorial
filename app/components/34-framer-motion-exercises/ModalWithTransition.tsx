'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModalWithTransition = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="card flex flex-col items-center relative">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 7: Modal with Transition</h3>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Open Modal
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: "-100vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <h4 className="text-xl font-bold mb-4 text-gray-800">Modal Title</h4>
              <p className="text-gray-600 mb-6">This is a modal with a smooth transition effect.</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Close Modal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModalWithTransition;
