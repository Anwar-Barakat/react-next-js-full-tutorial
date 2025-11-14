'use client';
import React from 'react';
import FadeInComponent from './FadeInComponent';
import NavigationMenu from './NavigationMenu';
import TooltipWithVariants from './TooltipWithVariants';
import ToggleSwitch from './ToggleSwitch';
import DynamicList from './DynamicList';

const FramerMotionVariants = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Framer Motion Variants
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FadeInComponent />
        <NavigationMenu />
        <TooltipWithVariants />
        <ToggleSwitch />
        <DynamicList />
      </div>
    </div>
  );
};

export default FramerMotionVariants;
