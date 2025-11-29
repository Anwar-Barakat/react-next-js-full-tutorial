'use client';
import React from "react";
import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";

const DraggableBox = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  useMotionValueEvent(x, "change", (latest) =>
    setPosition((prev) => ({ ...prev, x: latest }))
  );
  useMotionValueEvent(y, "change", (latest) =>
    setPosition((prev) => ({ ...prev, y: latest }))
  );

  return (
    <div className="glass flex flex-col items-center">
      <h3 className="text-xl font-bold text-foreground mb-4">Exercise 1: Draggable Box</h3>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 ">
        <motion.div
          className="w-32 h-32 bg-primary/50 rounded-lg shadow-lg cursor-grab"
          drag
          style={{ x, y }}
          dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
          whileDrag={{ scale: 1.05 }}
        />
        <p className="text-lg font-semibold text-foreground">
          Position: ({position.x.toFixed(0)}, {position.y.toFixed(0)})
        </p>
      </div>
    </div>
  );
};

export default DraggableBox;