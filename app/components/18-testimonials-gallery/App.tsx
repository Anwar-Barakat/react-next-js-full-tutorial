import React from 'react';
import { Testimonials } from './components/Testimonials';
import { Gallery } from './components/Gallery';

export const App = () => {
  return (
    <>
      <Testimonials />
      <hr className="my-8 border-gray-300" /> 
      <Gallery />
    </>
  );
};