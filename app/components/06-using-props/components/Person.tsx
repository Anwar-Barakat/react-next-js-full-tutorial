interface PersonProps {
  name: string;
  age: number;
}

const Person = (props: PersonProps) => {
  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full themed-card p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 center-text">
          Name: {props.name}
        </h2>
        <p className="text-lg text-muted-foreground center-text">
          Age: {props.age}
        </p>
      </div>
    </div>
  );
};

export default Person;