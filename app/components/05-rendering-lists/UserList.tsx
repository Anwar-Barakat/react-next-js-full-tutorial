const UserList = () => {
  const users = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 22 },
  ];

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 center-text">
          User List
        </h2>
        <div className="space-y-3">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="p-4 border border-border rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <p className="text-foreground">
                <span className="font-semibold">Name:</span> {user.name}, <span className="font-semibold">Age:</span> {user.age}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
