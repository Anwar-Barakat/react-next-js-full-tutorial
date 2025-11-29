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
    <div className="">
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
