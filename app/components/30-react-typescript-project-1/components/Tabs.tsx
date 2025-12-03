"use client";

import React, { useState, useMemo, useCallback, KeyboardEvent } from "react";
import { GoProjectSymlink } from "react-icons/go";
import { FaHome, FaInfoCircle, FaPhone } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import Card from "./Card";
import About from "./About";
import Contact from "./Contact";

interface TabItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
}

const tabs: TabItem[] = [
  {
    id: "home",
    icon: <FaHome aria-hidden="true" />,
    label: "Home",
    content: (
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            title={`Amazing Card ${index + 1}`}
            description="This is a cool-looking card component using React and Tailwind CSS."
            image="https://via.placeholder.com/400x300"
            link="#"
          />
        ))}
      </div>
    ),
  },
  {
    id: "about",
    icon: <FaInfoCircle aria-hidden="true" />,
    label: "About",
    content: <About />,
  },
  {
    id: "projects",
    icon: <GoProjectSymlink aria-hidden="true" />,
    label: "Projects",
    content: (
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            title={`Project ${index + 1}`}
            description="A description of a fantastic project built with modern web technologies."
            image="https://via.placeholder.com/400x300"
            link="#"
          />
        ))}
      </div>
    ),
  },
  {
    id: "courses",
    icon: <SiCoursera aria-hidden="true" />,
    label: "Courses",
    content: (
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            title={`Course ${index + 1}`}
            description="An engaging course covering advanced React concepts and best practices."
            image="https://via.placeholder.com/400x300"
            link="#"
          />
        ))}
      </div>
    ),
  },
  {
    id: "contact",
    icon: <FaPhone aria-hidden="true" />,
    label: "Contact",
    content: <Contact />,
  },
];

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const activeContent = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTab)?.content;
  }, [activeTab]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, tabId: string, index: number) => {
    let targetIndex = index;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        targetIndex = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        e.preventDefault();
        targetIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        e.preventDefault();
        targetIndex = 0;
        break;
      case "End":
        e.preventDefault();
        targetIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const targetTab = tabs[targetIndex];
    if (targetTab) {
      handleTabChange(targetTab.id);
      const targetButton = document.querySelector(
        `[data-tab-id="${targetTab.id}"]`
      ) as HTMLButtonElement;
      targetButton?.focus();
    }
  }, [handleTabChange]);

  return (
    <div className="glass glass-xl w-full">
      <div
        role="tablist"
        aria-label="Content tabs"
        className="flex border-b-2 border-glass-border mb-6 overflow-x-auto scrollbar-hide"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`flex items-center gap-2 px-5 py-3 text-base font-semibold transition-all duration-300 focus:outline-none rounded-t-lg whitespace-nowrap relative ${activeTab === tab.id
              ? "text-primary bg-white/10 border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
          >
            <span className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="p-4 md:p-6"
      >
        {activeContent}
      </div>
    </div>
  );
};

export default Tabs;