interface MealCardProps {
  meal: {
    id: number;
    name: string;
    image: string;
    instructions: string[];
  };
}

const MealCard = ({ meal }: MealCardProps) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <img src={meal.image} alt={meal.name} className="w-full h-48 object-cover rounded-md mb-4" />
      <h3 className="text-xl font-bold mb-2">{meal.name}</h3>
      <p className="text-gray-700">{meal.instructions[0].substring(0, 100)}...</p>
    </div>
  );
};

export default MealCard;
