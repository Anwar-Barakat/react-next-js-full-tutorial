'use client';
import React from 'react';
import StaggeredFadeSlideIn from './StaggeredFadeSlideIn';
import CardFlipInView from './CardFlipInView';
import ComplexTimeline from './ComplexTimeline';
import InteractiveCards from './InteractiveCards';
import ScrollProgressBar from './ScrollProgressBar';
import LoaderAnimation from './LoaderAnimation';
import DraggableCards from './DraggableCards';
import HorizontalScrollGallery from './HorizontalScrollGallery';

const FramerMotionAdvanced = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      <StaggeredFadeSlideIn />
      <CardFlipInView />
      <ComplexTimeline />
      <InteractiveCards />
      <ScrollProgressBar />
      <LoaderAnimation />
      <DraggableCards />
      <HorizontalScrollGallery />
    </div>
  );
};

export default FramerMotionAdvanced;