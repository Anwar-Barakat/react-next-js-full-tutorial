'use client';
import { useContext } from 'react';
import { UserContext } from './UserContext';

const UserProfile = () => {
  const context = useContext(UserContext);

  if (!context) {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full glass rounded-lg p-6 md:p-8">
          <p className="text-lg text-muted-foreground center-text">Loading...</p>
        </div>
      </div>
    );
  }

  const { user } = context;

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full glass rounded-lg p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 center-text">
          User Profile
        </h2>
        <div className="p-4 glass rounded-lg">
          <p className="text-lg text-foreground center-text">
            <span className="font-semibold">Name:</span> {user.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
