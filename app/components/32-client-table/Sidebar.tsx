import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen glass text-[var(--foreground)] flex flex-col">
      <div className="h-20 flex items-center justify-center">
        <h1 className="text-2xl font-bold heading-gradient">Dashboard</h1>
      </div>
      <nav className="flex-1 px-4 py-8 space-y-2">
        <a
          href="#"
          className="flex items-center px-4 py-2 text-[var(--muted-foreground)] hover:bg-primary hover:text-[var(--foreground)] rounded-md transition-all duration-200"
        >
          <span className="mr-2">📊</span>
          <span>Dashboard</span>
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 text-[var(--muted-foreground)] hover:bg-primary hover:text-[var(--foreground)] rounded-md transition-all duration-200"
        >
          <span className="mr-2">👥</span>
          <span>Clients</span>
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 text-[var(--muted-foreground)] hover:bg-primary hover:text-[var(--foreground)] rounded-md transition-all duration-200"
        >
          <span className="mr-2">📁</span>
          <span>Projects</span>
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 text-[var(--muted-foreground)] hover:bg-primary hover:text-[var(--foreground)] rounded-md transition-all duration-200"
        >
          <span className="mr-2">⚙️</span>
          <span>Settings</span>
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
