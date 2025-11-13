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
    <article className="max-w-sm mx-auto m-3 rounded-[var(--radius)] shadow-[var(--shadow-md)] overflow-hidden bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] transition-transform duration-200 hover:shadow-[var(--shadow-lg)] hover:scale-105">
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
        <h2 className="text-2xl font-bold mb-2 text-[var(--foreground)]">{title}</h2>
        <p className="mb-4 text-[var(--muted-foreground)]">{description}</p>
        {link && (
          <a
            href={link}
            className="inline-block text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 rounded-[var(--radius)] transition-colors duration-200"
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
