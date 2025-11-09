const Greeting = () => {
  const name = "John";
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h1 className="text-2xl font-bold">Hello, {name}!</h1>
      <p className="mt-2">Today's date is: {currentDate}</p>
    </div>
  );
};

export default Greeting;
