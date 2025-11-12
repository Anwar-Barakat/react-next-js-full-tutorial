'use client';
import React, { createContext, useContext, useState, ReactNode } from "react";

interface CounterContextProps {
  count: number;
  increment: () => void;
  decrement: () => void;
}

// Create the context with a default undefined value, which will be checked in the hook
export const CounterContext = createContext<CounterContextProps | undefined>(undefined);

// Custom hook to consume the context
export const useCounter = (): CounterContextProps => {
  const context = useContext(CounterContext);
  if (!context) {
    // This error will be thrown if useCounter is used outside of a CounterProvider
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
};

interface CounterProviderProps {
  children: ReactNode;
}

// Provider component that manages the state and provides it to children
export const CounterProvider: React.FC<CounterProviderProps> = ({ children }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = ()s => setCount((prev) => prev - 1);

  // The value provided to the context
  const contextValue = { count, increment, decrement };

  return (
    <CounterContext.Provider value={contextValue}>
      {children}
    </CounterContext.Provider>
  );
};
