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
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md dark:bg-gray-800 text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-2">User Profile (Complex State)</h3>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <button
        onClick={updateAge}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
      >
        Celebrate Birthday!
      </button>
    </div>
  );
};
