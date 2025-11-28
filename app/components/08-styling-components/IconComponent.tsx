import { FaBeer } from 'react-icons/fa';

const IconComponent = () => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 center-text">
          Icon Component
        </h2>
        <div className="center-content">
          <FaBeer className="text-5xl text-accent" />
        </div>
      </div>
    </div>
  );
};

export default IconComponent;
