'use client';
import React from 'react';

type GreetProps = {
  name?: string;
};

const Greet = ({ name = "Guest" }: GreetProps) => {
  return (
    <div className="themed-card p-4">
      <h1 className="text-2xl font-bold text-primary">Hello, {name}!</h1>
    </div>
  );
};

export default Greet;