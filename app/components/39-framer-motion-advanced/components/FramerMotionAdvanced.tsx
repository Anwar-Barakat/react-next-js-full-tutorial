'use client';
import React from 'react';
import StaggeredFadeSlideIn from '../StaggeredFadeSlideIn';
import CardFlipInView from '../CardFlipInView';
import ComplexTimeline from '../ComplexTimeline';
import InteractiveCards from '../InteractiveCards';
import ScrollProgressBar from '../ScrollProgressBar';
import LoaderAnimation from '../LoaderAnimation';
import DraggableCards from '../DraggableCards';
import HorizontalScrollGallery from '../HorizontalScrollGallery';

const FramerMotionAdvanced = () => {
  return (
    <div className="glass mx-auto my-8 max-w-7xl">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
          Framer Motion Advanced Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StaggeredFadeSlideIn />
          <CardFlipInView />
          <ComplexTimeline />
          <InteractiveCards />
          <ScrollProgressBar />
          <LoaderAnimation />
          <DraggableCards />
          <HorizontalScrollGallery />
        </div>
      </div>
    </div>
  );
};

export default FramerMotionAdvanced;