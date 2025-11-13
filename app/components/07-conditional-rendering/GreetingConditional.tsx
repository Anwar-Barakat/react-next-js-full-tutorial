interface GreetingProps {
  timeOfDay: 'morning' | 'afternoon';
}

const GreetingConditional = (props: GreetingProps) => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        {props.timeOfDay === 'morning' ? (
          <p className="text-2xl font-bold heading-gradient center-text">
            Good morning! ☀️
          </p>
        ) : (
          <p className="text-2xl font-bold heading-gradient-secondary center-text">
            Good afternoon! 🌅
          </p>
        )}
      </div>
    </div>
  );
};

export default GreetingConditional;
