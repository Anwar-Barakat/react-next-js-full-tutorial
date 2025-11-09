interface GreetingProps {
  timeOfDay: 'morning' | 'afternoon';
}

const GreetingConditional = (props: GreetingProps) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      {props.timeOfDay === 'morning' ? (
        <p className="text-yellow-600">Good morning!</p>
      ) : (
        <p className="text-orange-600">Good afternoon!</p>
      )}
    </div>
  );
};

export default GreetingConditional;
