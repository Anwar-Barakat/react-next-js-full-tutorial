'use client';
import { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({ name: 'John Doe', age: 30 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-2">Profile</h2>
      <p className="mb-2">Name: {profile.name}</p>
      <p className="mb-4">Age: {profile.age}</p>
      <input
        type="text"
        name="name"
        value={profile.name}
        onChange={handleInputChange}
        className="p-2 border border-gray-300 rounded mr-2"
      />
      <input
        type="number"
        name="age"
        value={profile.age}
        onChange={handleInputChange}
        className="p-2 border border-gray-300 rounded"
      />
    </div>
  );
};

export default Profile;
