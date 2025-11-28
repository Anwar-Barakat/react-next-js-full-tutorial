interface GreetingProps {
  timeOfDay: 'morning' | 'afternoon';
}

const GreetingConditional = (props: GreetingProps) => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 md:p-8">
        {props.timeOfDay === 'morning' ? (
          <p className="text-2xl font-bold text-foreground center-text">
            Good morning! ☀️
          </p>
        ) : (
          <p className="text-2xl font-bold text-foreground center-text">
            Good afternoon! 🌅
          </p>
        )}
      </div>
    </div>
  );
};

export default GreetingConditional;
