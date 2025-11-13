'use client';
import React from 'react';
import BasicAnimation from './BasicAnimation';
import AnimationProperties from './AnimationProperties';
import VariantsAnimation from './VariantsAnimation';
import FlippingCard from './FlippingCard';
import HoverAnimation from './HoverAnimation';
import DragAnimation from './DragAnimation';
import CardAnimation from './CardAnimation';
import VariantsExample from './VariantsExample';
import StaggerChildren from './StaggerChildren';
import GalleryAnimation from './GalleryAnimation';

const FramerMotionDemo = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Framer Motion Fundamentals
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BasicAnimation />
        <AnimationProperties />
        <VariantsAnimation />
        <FlippingCard />
        <HoverAnimation />
        <DragAnimation />
        <CardAnimation />
        <VariantsExample />
        <StaggerChildren />
        <GalleryAnimation />
      </div>
    </div>
  );
};

export default FramerMotionDemo;
