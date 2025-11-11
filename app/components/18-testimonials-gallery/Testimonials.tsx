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
    <div className="p-5 text-center">
      <h2 className="mb-5 text-gray-200">What Our Clients Say</h2>
      <div className="flex justify-center items-center">
        <div className="bg-gray-700 text-gray-200 border border-gray-600 rounded-lg p-5 m-2.5 max-w-md shadow-md flex items-center relative">
          <Image src={currentTestimonial.avatar} alt={`Avatar of ${currentTestimonial.author}`} className="w-16 h-16 rounded-full mr-5" width={150} height={150}/>
          <div>
            <p className="italic">{currentTestimonial.text}</p>
            <p className="font-bold mt-2.5 text-right">- {currentTestimonial.author}</p>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button onClick={handleBack} className="py-2 px-4 text-base cursor-pointer rounded-md border border-gray-600 bg-gray-800 text-gray-200 m-2.5">Back</button>
        <button onClick={handleNext} className="py-2 px-4 text-base cursor-pointer rounded-md border border-gray-600 bg-gray-800 text-gray-200 m-2.5">Next</button>
      </div>
    </div>
  );
};
