import React from 'react';
import { Testimonials } from './Testimonials';
import { Gallery } from './Gallery';

export const App = () => {
  return (
    <>
      <Testimonials />
      <hr className="my-8 border-gray-300" /> 
      <Gallery />
    </>
  );
};

