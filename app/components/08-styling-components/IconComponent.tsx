import { FaBeer } from 'react-icons/fa';

const IconComponent = () => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 center-text">
          Icon Component
        </h2>
        <div className="center-content">
          <FaBeer style={{ fontSize: '48px' }} className="text-[var(--accent)]" />
        </div>
      </div>
    </div>
  );
};

export default IconComponent;
