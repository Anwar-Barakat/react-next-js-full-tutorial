'use client';
import { useContext } from 'react';
import { UserContext } from './UserContext';

const UserProfile = () => {
  const context = useContext(UserContext);

  if (!context) {
    return <div className="p-4 mb-4">Loading...</div>;
  }

  const { user } = context;

  return (
    <div className="p-4 mb-4 border-b border-gray-200">
      <h2 className="text-2xl font-bold mb-2">User Profile</h2>
      <p className="mt-2">Name: {user.name}</p>
    </div>
  );
};

export default UserProfile;
