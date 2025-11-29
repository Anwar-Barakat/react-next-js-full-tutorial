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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
  );
}

export default FramerMotionDemo;
