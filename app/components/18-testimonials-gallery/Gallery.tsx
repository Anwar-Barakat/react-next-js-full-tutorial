'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const images = [
  'https://picsum.photos/seed/1/600/400',
  'https://picsum.photos/seed/2/600/400',
  'https://picsum.photos/seed/3/600/400',
  'https://picsum.photos/seed/4/600/400',
  'https://picsum.photos/seed/5/600/400',
  'https://picsum.photos/seed/6/600/400',
  'https://picsum.photos/seed/7/600/400',
  'https://picsum.photos/seed/8/600/400',
  'https://picsum.photos/seed/9/600/400',
];

const IMAGES_PER_VIEW = 3;

export const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const getImagesForView = () => {
    const imagesToShow = [];
    for (let i = 0; i < IMAGES_PER_VIEW; i++) {
      imagesToShow.push(images[(currentIndex + i) % images.length]);
    }
    return imagesToShow;
  };

  return (
    <div className="p-5 text-center relative max-w-4xl mx-auto">
      <h2 className="mb-5 text-gray-200">Our Gallery</h2>
      <button onClick={handleBack} className="absolute top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white border-none p-2.5 cursor-pointer text-2xl z-10 left-[-10px]">&#10094;</button>
      <div className="overflow-hidden">
        <div className="flex gap-4">
          {getImagesForView().map((src, index) => (
            <div key={index} className={`min-w-[calc(100%/${IMAGES_PER_VIEW}-10px)] overflow-hidden rounded-lg shadow-lg`}>
              <Image src={src} alt={`Gallery image ${index + 1}`} className="w-full block object-cover" width={600} height={400}/>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleNext} className="absolute top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white border-none p-2.5 cursor-pointer text-2xl z-10 right-[-10px]">&#10095;</button>
    </div>
  );
};
