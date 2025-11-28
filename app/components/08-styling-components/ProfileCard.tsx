import React from 'react';

const ProfileCard = () => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 center-text">
          Profile Card
        </h2>
        <p className="text-lg text-muted-foreground center-text">
          This card is styled with Tailwind CSS.
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
