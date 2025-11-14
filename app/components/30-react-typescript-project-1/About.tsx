"use client";

import React from "react";

const About: React.FC = () => {
  return (
    <section 
      className="py-12 px-8 bg-[var(--card)] text-[var(--foreground)] rounded-[var(--radius)] shadow-[var(--shadow-md)] border border-[var(--border)]"
      aria-labelledby="about-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h2 id="about-heading" className="text-3xl font-extrabold mb-6 center-text text-[var(--foreground)]">
          About Anwar WebDev
        </h2>
        <div className="space-y-4">
          <p className="text-lg leading-relaxed text-[var(--muted-foreground)]">
            Welcome to my profile! I&apos;m a passionate web developer dedicated to creating
            exceptional digital experiences. With expertise in modern web technologies,
            I specialize in building responsive, accessible, and performant applications
            that delight users and solve real-world problems.
          </p>
          <p className="text-lg leading-relaxed text-[var(--muted-foreground)]">
            My journey in web development has been driven by a constant curiosity to learn
            and implement cutting-edge technologies. I&apos;m particularly passionate about React,
            TypeScript, and the ever-evolving ecosystem of frontend development tools.
          </p>
          <p className="text-lg leading-relaxed text-[var(--muted-foreground)]">
            When I&apos;m not coding, you&apos;ll find me sharing knowledge through tutorials,
            contributing to open-source projects, and exploring new ways to make the web
            a better place for everyone. Feel free to explore my projects and courses to
            see what I&apos;ve been working on!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
