'use client';
import React, { useState } from 'react';

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

const galleryContainerStyle = {
  padding: '20px',
  textAlign: 'center' as const,
  position: 'relative' as const,
  maxWidth: '900px',
  margin: '0 auto',
};

const slideWrapperStyle = {
  overflow: 'hidden',
};

const slideStyle = {
  display: 'flex',
  gap: '15px',
};

const imageWrapperStyle = {
  minWidth: `calc(100% / ${IMAGES_PER_VIEW} - 10px)`,
  overflow: 'hidden',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const imageStyle = {
  width: '100%',
  display: 'block',
  objectFit: 'cover' as const,
};

const navigationButtonStyle = {
  position: 'absolute' as const,
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  border: 'none',
  padding: '10px',
  cursor: 'pointer',
  fontSize: '1.5rem',
  zIndex: 1,
};

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
    <div style={galleryContainerStyle}>
      <h2 style={{ marginBottom: '20px', color: '#eee' }}>Our Gallery</h2>
      <button onClick={handleBack} style={{ ...navigationButtonStyle, left: '-10px' }}>&#10094;</button>
      <div style={slideWrapperStyle}>
        <div style={slideStyle}>
          {getImagesForView().map((src, index) => (
            <div key={index} style={imageWrapperStyle}>
              <img src={src} alt={`Gallery image ${index + 1}`} style={imageStyle} />
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleNext} style={{ ...navigationButtonStyle, right: '-10px' }}>&#10095;</button>
    </div>
  );
};
