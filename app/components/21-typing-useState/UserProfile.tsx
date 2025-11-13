'use client';
import React, { useState } from 'react';

// Define an interface for the user profile object
interface UserProfileType {
  name: string;
  age: number;
  email: string;
}

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
    <div className="p-6 border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-md)] bg-[var(--card)] text-[var(--foreground)]">
      <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">User Profile (Complex State)</h3>
      <div className="space-y-2 mb-4">
        <p className="text-[var(--muted-foreground)]"><span className="font-semibold text-[var(--foreground)]">Name:</span> {user.name}</p>
        <p className="text-[var(--muted-foreground)]"><span className="font-semibold text-[var(--foreground)]">Age:</span> {user.age}</p>
        <p className="text-[var(--muted-foreground)]"><span className="font-semibold text-[var(--foreground)]">Email:</span> {user.email}</p>
      </div>
      <button
        onClick={updateAge}
        className="px-6 py-3 bg-[var(--accent)] text-white rounded-[var(--radius)] hover:bg-[var(--accent)]/90 transition-colors duration-200 font-semibold shadow-[var(--shadow-sm)]"
      >
        Celebrate Birthday!
      </button>
    </div>
  );
};
