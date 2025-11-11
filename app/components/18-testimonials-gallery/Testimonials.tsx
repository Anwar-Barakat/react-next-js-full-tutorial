'use client';
import React, { useState } from 'react';

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

const testimonialCardStyle = {
  backgroundColor: '#444',
  color: '#eee',
  border: '1px solid #555',
  borderRadius: '8px',
  padding: '20px',
  margin: '10px',
  maxWidth: '400px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'center',
  position: 'relative' as const,
};

const avatarStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  marginRight: '20px',
};

const textContainerStyle = {
  fontStyle: 'italic',
};

const authorStyle = {
  fontWeight: 'bold',
  marginTop: '10px',
  textAlign: 'right' as const,
};

const navigationButtonStyle = {
  padding: '8px 16px',
  fontSize: '1rem',
  cursor: 'pointer',
  borderRadius: '5px',
  border: '1px solid #555',
  backgroundColor: '#333',
  color: '#eee',
  margin: '0 10px',
};

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
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px', color: '#eee' }}>What Our Clients Say</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={testimonialCardStyle}>
          <img src={currentTestimonial.avatar} alt={`Avatar of ${currentTestimonial.author}`} style={avatarStyle} />
          <div>
            <p style={textContainerStyle}>{currentTestimonial.text}</p>
            <p style={authorStyle}>- {currentTestimonial.author}</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleBack} style={navigationButtonStyle}>Back</button>
        <button onClick={handleNext} style={navigationButtonStyle}>Next</button>
      </div>
    </div>
  );
};
