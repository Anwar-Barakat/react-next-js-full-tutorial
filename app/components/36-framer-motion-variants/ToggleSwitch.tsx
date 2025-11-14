'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const switchVariants = {
  on: { backgroundColor: "#22c55e", x: 20 },
  off: { backgroundColor: "#ef4444", x: 0 },
};

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Exercise 4: Toggle Switch</h3>
      <div
        className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer"
        style={{ backgroundColor: isOn ? "#22c55e" : "#ef4444" }}
        onClick={() => setIsOn(!isOn)}
      >
        <motion.div
          className="w-6 h-6 bg-white rounded-full shadow-md"
          variants={switchVariants}
          animate={isOn ? "on" : "off"}
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        />
      </div>
      <p className="mt-2 text-white">{isOn ? "ON" : "OFF"}</p>
    </div>
  );
};

export default ToggleSwitch;
