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
    <article className="glass glass-lg max-w-sm mx-auto my-3 overflow-hidden text-center hover:shadow-xl hover:scale-105 transition-transform duration-200">
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
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
        <h2 className="text-2xl font-bold mb-2 text-primary">{title}</h2>
        <p className="mb-4 text-foreground">{description}</p>
        {link && (
          <a
            href={link}
            className="link"
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