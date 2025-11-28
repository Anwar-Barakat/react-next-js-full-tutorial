import { User as UserIcon } from 'lucide-react';

type User = {
  id: number;
  name: string;
  email: string;
};

type UserListProps = {
  users: User[];
};

const UserList = ({ users }: UserListProps) => {
  return (
    <div className="w-full max-w-md space-y-3">
      {users.map((user) => (
        <div 
          key={user.id} 
          className="p-3 rounded-lg flex items-center glass hover:shadow-lg transition-colors"
        >
          <div className="p-2 bg-primary/20 rounded-full mr-4">
            <UserIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
