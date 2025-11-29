'use client';
import React from 'react';
import StaggeredListItems from './StaggeredListItems';
import StaggeredImageGallery from './StaggeredImageGallery';
import StaggeredButtonPress from './StaggeredButtonPress';
import StaggeredGridLayout from './StaggeredGridLayout';
import StaggeredTextReveal from './StaggeredTextReveal';

const FramerMotionStagger = () => {
  return (
    <div className="mx-auto my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <StaggeredListItems />
        <StaggeredImageGallery />
        <StaggeredButtonPress />
        <StaggeredGridLayout />
        <StaggeredTextReveal />
      </div>
    </div>
  );
};

export default FramerMotionStagger;
