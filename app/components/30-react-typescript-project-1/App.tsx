"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Profile from "./Profile";

export const App: React.FC = () => {
  return (
    <main className="flex min-h-screen">
      <Sidebar />
      <Profile />
    </main>
  );
};

export default App;
