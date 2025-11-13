"use client";

import React, { FC, useMemo } from "react";

interface CardProps {
  title: string;
  description: string;
  image: string;
  link?: string;
  imageAlt?: string;
}

const Card: FC<CardProps> = ({ title, description, image, link, imageAlt }) => {
  const isExternalLink = useMemo(() => {
    if (!link) return false;
    if (typeof window === "undefined") {
      // SSR fallback: check if link starts with http/https
      return link.startsWith("http://") || link.startsWith("https://");
    }
    try {
      const url = new URL(link, window.location.origin);
      return url.origin !== window.location.origin;
    } catch {
      return link.startsWith("http://") || link.startsWith("https://");
    }
  }, [link]);

  const altText = imageAlt || `${title} image`;

  return (
    <article className="max-w-sm mx-auto m-3 rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-transform duration-200 hover:shadow-lg hover:scale-105">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={image}
          alt={altText}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
          }}
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">{description}</p>
        {link && (
          <a
            href={link}
            className="inline-block text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors duration-200"
            target={isExternalLink ? "_blank" : undefined}
            rel={isExternalLink ? "noopener noreferrer" : undefined}
            aria-label={`Learn more about ${title}`}
          >
            Learn more
          </a>
        )}
      </div>
    </article>
  );
};

export default Card;
