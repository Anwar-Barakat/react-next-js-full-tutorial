'use client';
import React, { useState } from 'react';
import { UserProfileType } from './types';

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfileType>({
    name: 'Alice Smith',
    age: 30,
    email: 'alice.smith@example.com',
  });

  const updateAge = () => {
    setUser(prevUser => ({
      ...prevUser,
      age: prevUser.age + 1,
    }));
  };

  return (
    <div className="glass glass-lg w-full text-center">
      <h3 className="text-xl font-semibold mb-4 text-primary">User Profile (Complex State)</h3>
      <div className="space-y-2 mb-4">
        <p className="text-foreground text-left"><span className="font-semibold text-primary">Name:</span> {user.name}</p>
        <p className="text-foreground text-left"><span className="font-semibold text-primary">Age:</span> {user.age}</p>
        <p className="text-foreground text-left"><span className="font-semibold text-primary">Email:</span> {user.email}</p>
      </div>
      <button
        onClick={updateAge}
        className="btn bg-accent/50"
      >
        Celebrate Birthday!
      </button>
    </div>
  );
};