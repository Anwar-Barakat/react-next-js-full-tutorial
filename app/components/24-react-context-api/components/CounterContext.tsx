'use client';
import React, { createContext, useContext, useState, ReactNode } from "react";

interface CounterContextProps {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const CounterContext = createContext<CounterContextProps | undefined>(undefined);

export const useCounter = (): CounterContextProps => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
};

interface CounterProviderProps {
  children: ReactNode;
}

export const CounterProvider: React.FC<CounterProviderProps> = ({ children }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  const contextValue = { count, increment, decrement };

  return (
    <CounterContext.Provider value={contextValue}>
      {children}
    </CounterContext.Provider>
  );
};