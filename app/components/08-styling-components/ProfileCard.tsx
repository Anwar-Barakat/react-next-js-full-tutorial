import React from 'react';

const ProfileCard = () => {
  const styles: React.CSSProperties = {
    backgroundColor: 'lightgray',
    padding: '15px',
    borderRadius: '8px',
    color: 'black',
  };

  return (
    <div style={styles}>
      <h2>Profile Card</h2>
      <p>This card is styled with a separate style object.</p>
    </div>
  );
};

export default ProfileCard;
