"use client";

import React from 'react';

const PeopleToFollow = () => {
  return (
    <div className="glass rounded-2xl shadow-lg p-5 mb-4 text-foreground">
      <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></span>
        Who to follow
      </h3>
      <ul className="space-y-3">
        <li className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-all duration-300 hover:shadow-[var(--shadow-sm)] group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-primary font-bold">U1</span>
            </div>
            <span className="text-foreground font-medium">User One</span>
          </div>
          <button className="btn btn-primary btn-sm rounded-full">
            Follow
          </button>
        </li>
        <li className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-all duration-300 hover:shadow-[var(--shadow-sm)] group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-accent font-bold">U2</span>
            </div>
            <span className="text-foreground font-medium">User Two</span>
          </div>
          <button className="btn btn-primary btn-sm rounded-full">
            Follow
          </button>
        </li>
        <li className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-all duration-300 hover:shadow-[var(--shadow-sm)] group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-secondary font-bold">U3</span>
            </div>
            <span className="text-foreground font-medium">User Three</span>
          </div>
          <button className="btn btn-primary btn-sm rounded-full">
            Follow
          </button>
        </li>
      </ul>
    </div>
  );
};

export default PeopleToFollow;
