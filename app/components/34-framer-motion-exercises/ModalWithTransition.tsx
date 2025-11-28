'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModalWithTransition = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="glass flex flex-col items-center relative">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Exercise 7: Modal with Transition</h3>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn bg-[var(--primary)]/50 mb-4"
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
              className="glass p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <h4 className="text-xl font-bold mb-4 text-[var(--foreground)]">Modal Title</h4>
              <p className="text-[var(--muted-foreground)] mb-6">This is a modal with a smooth transition effect.</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn bg-[var(--secondary)]/50"
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
