"use client";

import React, { useState } from "react";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { GoProjectSymlink } from "react-icons/go";
import { SiCoursera } from "react-icons/si";
import { FaPhone } from "react-icons/fa";

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
}

const topNavItems: NavItem[] = [
  { id: "home", icon: <FaHome size={24} />, label: "Home" },
  { id: "profile", icon: <FaUser size={24} />, label: "Profile" },
  { id: "projects", icon: <GoProjectSymlink size={24} />, label: "Projects" },
  { id: "courses", icon: <SiCoursera size={24} />, label: "Courses" },
  { id: "contact", icon: <FaPhone size={24} />, label: "Contact" },
];

const bottomNavItems: NavItem[] = [
  { id: "search", icon: <FaSearch size={24} />, label: "Search" },
  { id: "settings", icon: <IoMdSettings size={24} />, label: "Settings" },
];

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("home");

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
    e.preventDefault();
    setActiveItem(itemId);
    const tabButton = document.querySelector(`[data-tab-id="${itemId}"]`) as HTMLButtonElement;
    if (tabButton) {
      tabButton.click();
    }
  };

  const renderNavItem = (item: NavItem, isActive: boolean) => (
    <li key={item.id}>
      <button
        onClick={(e) => handleNavClick(e, item.id)}
        className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          isActive
            ? "bg-primary/20 text-primary"
            : "hover:bg-white/10 text-foreground"
        }`}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
      >
        {item.icon}
      </button>
    </li>
  );

  return (
    <aside 
      className="sidebar fixed top-0 left-0 w-20 h-screen glass py-4 z-30 flex flex-col justify-between items-center"
      role="navigation"
      aria-label="Main navigation"
    >
      <nav aria-label="Primary navigation">
        <ul className="flex flex-col gap-6">
          {topNavItems.map((item) => renderNavItem(item, activeItem === item.id))}
        </ul>
      </nav>
      <nav aria-label="Secondary navigation">
        <ul className="flex flex-col gap-6">
          {bottomNavItems.map((item) => renderNavItem(item, activeItem === item.id))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;