'use client';
import React from 'react';
import StaggeredListItems from './StaggeredListItems';
import StaggeredImageGallery from './StaggeredImageGallery';
import StaggeredButtonPress from './StaggeredButtonPress';
import StaggeredGridLayout from './StaggeredGridLayout';
import StaggeredTextReveal from './StaggeredTextReveal';

const FramerMotionStagger = () => {
  return (
    <div className="glass mx-auto my-8 max-w-7xl">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
          Framer Motion Staggered Animations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StaggeredListItems />
          <StaggeredImageGallery />
          <StaggeredButtonPress />
          <StaggeredGridLayout />
          <StaggeredTextReveal />
        </div>
      </div>
    </div>
  );
};

export default FramerMotionStagger;
