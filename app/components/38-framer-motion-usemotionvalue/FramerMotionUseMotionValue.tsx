'use client';
import React from 'react';
import DraggableBox from './DraggableBox';
import HoverLinkedScale from './HoverLinkedScale';
import SpringAnimatedPosition from './SpringAnimatedPosition';
import DynamicRotation from './DynamicRotation';

const FramerMotionUseMotionValue = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Framer Motion useMotionValue
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DraggableBox />
        <HoverLinkedScale />
        <SpringAnimatedPosition />
        <DynamicRotation />
      </div>
    </div>
  );
};

export default FramerMotionUseMotionValue;
