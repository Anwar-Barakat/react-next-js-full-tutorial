'use client';
import { useContext } from 'react';
import { UserContext } from './UserContext';

const UserProfile = () => {
  const context = useContext(UserContext);

  if (!context) {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
          <p className="text-lg text-[var(--muted-foreground)] center-text">Loading...</p>
        </div>
      </div>
    );
  }

  const { user } = context;

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 center-text">
          User Profile
        </h2>
        <div className="p-4 bg-[var(--muted)] rounded-[var(--radius)]">
          <p className="text-lg text-[var(--foreground)] center-text">
            <span className="font-semibold">Name:</span> {user.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
