"use client";

import React from "react";
import { FaTwitter, FaYoutube, FaGithub, FaInstagram } from "react-icons/fa";

interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

const links: SocialLink[] = [
  {
    href: "https://twitter.com/@huxnwebdev",
    label: "Twitter",
    icon: <FaTwitter className="h-6 w-6 text-blue-500 dark:text-blue-400" aria-hidden="true" />,
    ariaLabel: "Visit my Twitter profile",
  },
  {
    href: "https://youtube.com/@huxnwebdev",
    label: "YouTube",
    icon: <FaYoutube className="h-6 w-6 text-red-600 dark:text-red-500" aria-hidden="true" />,
    ariaLabel: "Visit my YouTube channel",
  },
  {
    href: "https://github.com/HuXn-WebDev",
    label: "GitHub",
    icon: <FaGithub className="h-6 w-6 text-gray-900 dark:text-gray-100" aria-hidden="true" />,
    ariaLabel: "Visit my GitHub profile",
  },
  {
    href: "https://instagram.com/huxnshorts",
    label: "Instagram",
    icon: <FaInstagram className="h-6 w-6 text-pink-500 dark:text-pink-400" aria-hidden="true" />,
    ariaLabel: "Visit my Instagram profile",
  },
];

const Contact: React.FC = () => {
  return (
    <section 
      className="py-12 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-lg shadow-md"
      aria-labelledby="contact-heading"
    >
      <h2 id="contact-heading" className="text-3xl font-extrabold mb-6 text-center">
        Contact Me
      </h2>
      <div className="flex flex-wrap justify-center gap-8" role="list">
        {links.map((link) => (
          <a
            href={link.href}
            key={link.label}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label={link.ariaLabel}
            role="listitem"
          >
            {link.icon}
            <span className="mt-2 text-lg font-medium">{link.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Contact;
