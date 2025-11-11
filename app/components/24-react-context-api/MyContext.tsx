'use client';
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MyContextProps {
  count: number;
  increment: () => void;
  decrement: () => void;
}

// Create the context with a default undefined value, which will be checked in the hook
export const MyContext = createContext<MyContextProps | undefined>(undefined);

// Custom hook to consume the context
export const useMyContext = (): MyContextProps => {
  const context = useContext(MyContext);
  if (!context) {
    // This error will be thrown if useMyContext is used outside of a MyProvider
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};

interface MyProviderProps {
  children: ReactNode;
}

// Provider component that manages the state and provides it to children
export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  // The value provided to the context
  const contextValue = { count, increment, decrement };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};
