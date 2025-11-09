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
    <div className="p-4 mt-4">
      <h2 className="text-2xl font-bold mb-2">Update User</h2>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="New name"
        className="p-2 border border-gray-300 rounded mr-2"
      />
      <button 
        onClick={handleUpdate}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Update Name
      </button>
    </div>
  );
};

export default UpdateUser;
