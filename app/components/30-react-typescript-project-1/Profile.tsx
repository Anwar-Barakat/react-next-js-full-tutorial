"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaCamera } from "react-icons/fa";
import Tabs from "./Tabs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const Profile: React.FC = () => {
  const [bannerUrl, setBannerUrl] = useState<string>(
    "https://placehold.co/1500x400/png"
  );
  const [profileUrl, setProfileUrl] = useState<string>("https://placehold.co/100/png");
  const [bannerError, setBannerError] = useState<string>("");
  const [profileError, setProfileError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (bannerUrl && bannerUrl.startsWith("blob:")) {
        URL.revokeObjectURL(bannerUrl);
      }
      if (profileUrl && profileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(profileUrl);
      }
    };
  }, [bannerUrl, profileUrl]);

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, or WebP)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  }, []);

  const handleBannerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerError("");
    const error = validateFile(file);
    if (error) {
      setBannerError(error);
      e.target.value = ""; // Reset input
      return;
    }

    setIsUploading(true);
    try {
      const newUrl = URL.createObjectURL(file);
      // Revoke old URL if it was a blob
      if (bannerUrl && bannerUrl.startsWith("blob:")) {
        URL.revokeObjectURL(bannerUrl);
      }
      setBannerUrl(newUrl);
    } catch (err) {
      setBannerError("Failed to process image. Please try again.");
      console.error("Error processing banner image:", err);
    } finally {
      setIsUploading(false);
    }
  }, [bannerUrl, validateFile]);

  const handleProfileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileError("");
    const error = validateFile(file);
    if (error) {
      setProfileError(error);
      e.target.value = ""; // Reset input
      return;
    }

    setIsUploading(true);
    try {
      const newUrl = URL.createObjectURL(file);
      // Revoke old URL if it was a blob
      if (profileUrl && profileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(profileUrl);
      }
      setProfileUrl(newUrl);
    } catch (err) {
      setProfileError("Failed to process image. Please try again.");
      console.error("Error processing profile image:", err);
    } finally {
      setIsUploading(false);
    }
  }, [profileUrl, validateFile]);

  return (
    <section
      className="relative w-[calc(100%-5rem)] ml-[5rem] bg-[var(--background)] text-[var(--foreground)] min-h-screen"
      aria-label="User profile"
    >
      {/* Banner Section */}
      <div className="relative">
        <img
          src={bannerUrl}
          alt="Profile banner"
          className="w-full h-60 object-cover"
          loading="eager"
        />
        <div className="absolute top-4 right-4">
          <label
            htmlFor="banner-upload"
            className="cursor-pointer flex items-center justify-center bg-[var(--muted)] bg-opacity-75 text-white p-3 rounded-full hover:bg-opacity-100 transition-opacity duration-200 focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:ring-offset-2"
            aria-label="Upload banner image"
          >
            <FaCamera size={20} aria-hidden="true" />
            <input
              type="file"
              id="banner-upload"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="sr-only"
              onChange={handleBannerChange}
              disabled={isUploading}
              aria-describedby={bannerError ? "banner-error" : undefined}
            />
          </label>
          {bannerError && (
            <p id="banner-error" className="absolute top-full mt-2 right-0 text-sm text-[var(--secondary)] bg-[var(--card)] p-2 rounded-[var(--radius)] shadow-[var(--shadow-lg)] max-w-xs border border-[var(--border)]">
              {bannerError}
            </p>
          )}
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start p-4 -mt-16 md:-mt-20 z-10">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[var(--card)] overflow-hidden shadow-[var(--shadow-lg)]">
          <img
            src={profileUrl}
            alt="Profile picture"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute bottom-0 right-0">
            <label
              htmlFor="profile-upload"
              className="cursor-pointer flex items-center justify-center bg-[var(--muted)] bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity duration-200 focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:ring-offset-2"
              aria-label="Upload profile picture"
            >
              <FaCamera size={16} aria-hidden="true" />
              <input
                type="file"
                id="profile-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="sr-only"
                onChange={handleProfileChange}
                disabled={isUploading}
                aria-describedby={profileError ? "profile-error" : undefined}
              />
            </label>
            {profileError && (
              <p id="profile-error" className="absolute top-full mt-2 right-0 text-sm text-[var(--secondary)] bg-[var(--card)] p-2 rounded-[var(--radius)] shadow-[var(--shadow-lg)] max-w-xs z-20 border border-[var(--border)]">
                {profileError}
              </p>
            )}
          </div>
        </div>

        <div className="ml-0 md:ml-6 mt-4 md:mt-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Anwar WebDev</h1>
          <p className="text-[var(--muted-foreground)]" aria-label="View count">1M views</p>
          <p className="mt-2 max-w-xl text-[var(--muted-foreground)]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
            quam excepturi magni numquam rem laborum?
          </p>
          <button
            type="button"
            className="mt-4 px-6 py-2 bg-[var(--secondary)] text-white rounded-full hover:bg-[var(--secondary)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-2 transition-colors duration-200 shadow-[var(--shadow-md)] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            aria-label="Subscribe to Anwar WebDev"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="p-4">
        <Tabs />
      </div>
    </section>
  );
};

export default Profile;
