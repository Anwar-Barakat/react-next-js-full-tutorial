'use client';
import React from 'react';
import BouncingBall from './BouncingBall';
import PulsatingButton from './PulsatingButton';
import ColorChangeSquare from './ColorChangeSquare';
import SlidingText from './SlidingText';
import ZigzagBox from './ZigzagBox';
import WaveEffect from './WaveEffect';
import BackgroundAnimation from './BackgroundAnimation';

const FramerMotionKeyframes = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
        Framer Motion Keyframe Animations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BouncingBall />
        <PulsatingButton />
        <ColorChangeSquare />
        <SlidingText />
        <ZigzagBox />
        <WaveEffect />
        <BackgroundAnimation />
      </div>
    </div>
  );
};

export default FramerMotionKeyframes;
