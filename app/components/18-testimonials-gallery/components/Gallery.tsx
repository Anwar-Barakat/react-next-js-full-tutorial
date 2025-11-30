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
    <div className="glass glass-xl relative w-full p-0">
      <button
        onClick={handleBack}
        className="btn btn-primary absolute top-1/2 -translate-y-1/2 text-2xl z-10 left-[-20px] p-3 rounded-full"
      >
        &#10094;
      </button>
      <div className="overflow-hidden rounded-lg border border-glass-border">
        <div className="flex gap-4">
          {getImagesForView().map((src, index) => (
            <div key={index} className={`glass p-2 min-w-[calc(100%/${IMAGES_PER_VIEW}-10px)] overflow-hidden rounded-lg w-full`}>
              <Image src={src} alt={`Gallery image ${index + 1}`} className="w-full block object-cover" width={600} height={400} />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleNext}
        className="btn btn-primary absolute top-1/2 -translate-y-1/2 text-2xl z-10 right-[-20px] p-3 rounded-full"
      >
        &#10095;
      </button>
    </div>
  );
};