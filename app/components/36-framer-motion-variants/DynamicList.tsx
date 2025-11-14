'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const itemVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -50 },
};

const DynamicList = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 5: Dynamic List Animation</h3>
      <div className="flex mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          className="input mr-2"
        />
        <button onClick={addItem} className="btn btn-primary">
          Add
        </button>
      </div>
      <div className="w-full max-w-md bg-gray-700 rounded-lg p-4">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item} // Use item content as key for unique identification
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex justify-between items-center bg-gray-800 p-3 rounded-lg mb-2 text-white"
            >
              {item}
              <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600">
                Remove
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DynamicList;
