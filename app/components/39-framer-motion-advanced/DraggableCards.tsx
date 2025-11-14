'use client';
import React from "react";
import { motion } from "framer-motion";

const DraggableCardItem = ({ children, style }: { children: React.ReactNode, style: React.CSSProperties }) => {
  return (
    <motion.div
      className="rounded-3xl shadow-lg p-5 m-2 w-52 h-72 flex items-center justify-center text-white text-2xl font-bold"
      style={style}
      drag
      dragConstraints={{ left: -200, right: 200, bottom: 200, top: -200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{
        duration: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
};

const DraggableCards = () => {
  return (
    <div className="card flex flex-col items-center">
      <h3 className="text-xl font-bold text-white mb-4">Draggable Cards</h3>
      <div className="w-full h-96 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center relative">
        <DraggableCardItem
          style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c)" }}
        >
          Card 01
        </DraggableCardItem>
        <DraggableCardItem
          style={{ background: "linear-gradient(135deg, #5ee7df 0%, #b490ca)" }}
        >
          Card 02
        </DraggableCardItem>
        <DraggableCardItem
          style={{ background: "linear-gradient(135deg, #ff9a9a 0%, #fecfef)" }}
        >
          Card 03
        </DraggableCardItem>
      </div>
    </div>
  );
};

export default DraggableCards;