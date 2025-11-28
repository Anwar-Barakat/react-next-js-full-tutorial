'use client';
import { createContext, useState, ReactNode } from 'react';

interface User {
  name: string;
}

interface UserContextType {
  user: User;
  updateUser: (name: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({ name: 'John Doe' });

  const updateUser = (name: string) => {
    setUser({ name });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <div className="p-4 border border-border rounded-lg bg-card shadow-md text-foreground">
        {children}
      </div>
    </UserContext.Provider>
  );
};
