"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Profile from "./Profile";

export const App: React.FC = () => {
  return (
    <main className="flex min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--muted)]/30 to-[var(--background)]">
      <Sidebar />
      <Profile />
    </main>
  );
};

export default App;
