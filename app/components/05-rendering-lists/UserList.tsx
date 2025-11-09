const UserList = () => {
  const users = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 22 },
  ];

  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-2">User List</h2>
      {users.map((user) => (
        <div key={user.id} className="p-2 border-b border-gray-200">
          <p>Name: {user.name}, Age: {user.age}</p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
