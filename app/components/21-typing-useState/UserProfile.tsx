'use client';
import React, { useState } from 'react';
import { UserProfileType } from './types';

export const UserProfile: React.FC = () => {
  // Explicitly typing the state variable with the UserProfileType interface
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
    <div className="p-6 border border-border rounded-lg shadow-md bg-card text-foreground">
      <h3 className="text-xl font-semibold mb-4 text-foreground">User Profile (Complex State)</h3>
      <div className="space-y-2 mb-4">
        <p className="text-muted-foreground"><span className="font-semibold text-foreground">Name:</span> {user.name}</p>
        <p className="text-muted-foreground"><span className="font-semibold text-foreground">Age:</span> {user.age}</p>
        <p className="text-muted-foreground"><span className="font-semibold text-foreground">Email:</span> {user.email}</p>
      </div>
      <button
        onClick={updateAge}
        className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200 font-semibold shadow-sm"
      >
        Celebrate Birthday!
      </button>
    </div>
  );
};
