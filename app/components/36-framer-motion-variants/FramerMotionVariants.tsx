'use client';
import React from 'react';
import FadeInComponent from './FadeInComponent';
import NavigationMenu from './NavigationMenu';
import TooltipWithVariants from './TooltipWithVariants';
import ToggleSwitch from './ToggleSwitch';
import DynamicList from './DynamicList';
import SwipeableGallery from './SwipeableGallery';

const FramerMotionVariants = () => {
  return (
    <div className="glass mx-auto my-8 max-w-7xl">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
          Framer Motion Variants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FadeInComponent />
          <NavigationMenu />
          <TooltipWithVariants />
          <ToggleSwitch />
          <DynamicList />
          <SwipeableGallery />
        </div>
      </div>
    </div>
  );
};

export default FramerMotionVariants;
