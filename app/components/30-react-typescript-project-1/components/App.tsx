"use client";

import React from "react";
import Sidebar from './Sidebar';
import Profile from './Profile';

export const App: React.FC = () => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <Profile />
    </div>
  );
};

export default App;