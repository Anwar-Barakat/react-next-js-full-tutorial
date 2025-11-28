'use client';
import { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({ name: 'John Doe', age: 30 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full glass rounded-lg p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 center-text">
          Profile
        </h2>
        <div className="space-y-4 mb-6">
          <p className="text-lg text-muted-foreground">
            <span className="font-semibold text-foreground">Name:</span> {profile.name}
          </p>
          <p className="text-lg text-muted-foreground">
            <span className="font-semibold text-foreground">Age:</span> {profile.age}
          </p>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            className="input w-full"
          />
          <input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleInputChange}
            placeholder="Enter age"
            className="input w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
