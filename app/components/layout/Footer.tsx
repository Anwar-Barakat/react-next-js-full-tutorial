import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-12 py-6 border-t border-glass-border text-center text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Next.js & React Full Tutorial. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
