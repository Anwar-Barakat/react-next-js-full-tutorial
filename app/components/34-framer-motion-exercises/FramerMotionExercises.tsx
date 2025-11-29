'use client';
import React from 'react';
import BasicTranslation from './BasicTranslation';
import VerticalMovement from './VerticalMovement';
import RotationAnimation from './RotationAnimation';
import SkewedTransition from './SkewedTransition';
import FadeComponent from './FadeComponent';
import SlideInSidebar from './SlideInSidebar';
import ModalWithTransition from './ModalWithTransition';
import ResponsiveButton from './ResponsiveButton';
import NotificationToast from './NotificationToast';

const FramerMotionExercises = () => {
  return (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      <BasicTranslation />
      <VerticalMovement />
      <RotationAnimation />
      <SkewedTransition />
      <FadeComponent />
      <SlideInSidebar />
      <ModalWithTransition />
      <ResponsiveButton />
      <NotificationToast />
    </div>
  );
};

export default FramerMotionExercises;
