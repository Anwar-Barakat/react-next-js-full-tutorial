interface PersonProps {
  name: string;
  age: number;
}

const Person = (props: PersonProps) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold">Name: {props.name}</h2>
      <p className="mt-2">Age: {props.age}</p>
    </div>
  );
};

export default Person;