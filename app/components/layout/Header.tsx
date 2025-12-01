"use client";

import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface ComponentInfo {
  name: string;
  component: React.ReactNode;
}

interface HeaderProps {
  components: { [key: string]: ComponentInfo };
  selectedKey: string;
  setSelectedKey: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ components, selectedKey, setSelectedKey }) => {
  return (
    <header className="glass w-full p-4 rounded-lg mb-8 flex justify-between items-center">
      <div className="flex items-center">
        <Image src="/next.svg" alt="Logo" width={100} height={20} />
      </div>
      <div className="relative">
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          
          className="glass w-full h-10 pl-4 pr-10 text-base placeholder-gray-500 border rounded-lg appearance-none focus:outline-none focus:shadow-outline-blue"
        >
          {Object.keys(components)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((key) => (
              <option key={key} value={key}>
                {key}: {components[key].name}
              </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
