'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const switchVariants = {
  on: { backgroundColor: "#06b6d4", x: 20 },
  off: { backgroundColor: "#8b5cf6", x: 0 },
};

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 4: Toggle Switch</h3>
      <div
        className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer"
        style={{ backgroundColor: isOn ? "#06b6d4" : "#8b5cf6" }}
        onClick={() => setIsOn(!isOn)}
      >
                  <motion.div
                    className="w-6 h-6 bg-card rounded-full shadow-md"          variants={switchVariants}
          animate={isOn ? "on" : "off"}
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        />
      </div>
      <p className="mt-2 text-foreground">{isOn ? "ON" : "OFF"}</p>
    </div>
  );
};

export default ToggleSwitch;
