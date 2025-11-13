'use client';
import { useContext, useState } from 'react';
import { UserContext } from './UserContext';

const UpdateUser = () => {
  const context = useContext(UserContext);
  const [newName, setNewName] = useState('');

  if (!context) {
    return null;
  }

  const { updateUser } = context;

  const handleUpdate = () => {
    if (newName.trim() !== '') {
      updateUser(newName);
      setNewName('');
    }
  };

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 center-text">
          Update User
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New name"
            className="input flex-1"
          />
          <button 
            onClick={handleUpdate}
            className="btn btn-secondary"
          >
            Update Name
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
