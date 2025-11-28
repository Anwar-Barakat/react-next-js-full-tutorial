'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    author: 'Jane Doe',
    text: 'This is the best service I have ever used. Highly recommended!',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    author: 'John Smith',
    text: 'A game-changer for our business. The results were phenomenal.',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    author: 'Emily White',
    text: 'Incredible support and a fantastic product. Five stars!',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full max-w-2xl text-center">
      <h2 className="mb-8 text-3xl font-bold text-primary">
        What Our Clients Say
      </h2>
      <div className="flex justify-center items-center mb-6">
        <div className="glass glass-lg flex items-center relative max-w-md w-full text-left">
          <Image src={currentTestimonial.avatar} alt={`Avatar of ${currentTestimonial.author}`} className="w-16 h-16 rounded-full mr-5" width={150} height={150}/>
          <div>
            <p className="italic text-foreground">{currentTestimonial.text}</p>
            <p className="font-bold mt-2.5 text-right text-muted-foreground">- {currentTestimonial.author}</p>
          </div>
        </div>
      </div>
      <div className="center-content gap-3">
        <button 
          onClick={handleBack} 
          className="btn btn-primary"
        >
          Back
        </button>
        <button 
          onClick={handleNext} 
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
};