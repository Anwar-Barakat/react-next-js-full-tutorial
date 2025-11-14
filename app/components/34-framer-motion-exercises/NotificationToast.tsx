'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationToast = () => {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="card flex flex-col items-center relative">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 9: Notification Toast</h3>
      <button
        onClick={() => setShowToast(true)}
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Show Toast
      </button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Notification: Something happened!
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-white font-bold"
            >
              X
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
