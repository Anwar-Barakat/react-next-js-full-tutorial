"use client";

import React from "react";

const About: React.FC = () => {
  return (
    <section 
      className="py-12 px-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-lg shadow-md"
      aria-labelledby="about-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h2 id="about-heading" className="text-3xl font-extrabold mb-6 text-center">
          About Anwar WebDev
        </h2>
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Welcome to my profile! I'm a passionate web developer dedicated to creating
            exceptional digital experiences. With expertise in modern web technologies,
            I specialize in building responsive, accessible, and performant applications
            that delight users and solve real-world problems.
          </p>
          <p className="text-lg leading-relaxed">
            My journey in web development has been driven by a constant curiosity to learn
            and implement cutting-edge technologies. I'm particularly passionate about React,
            TypeScript, and the ever-evolving ecosystem of frontend development tools.
          </p>
          <p className="text-lg leading-relaxed">
            When I'm not coding, you'll find me sharing knowledge through tutorials,
            contributing to open-source projects, and exploring new ways to make the web
            a better place for everyone. Feel free to explore my projects and courses to
            see what I've been working on!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
