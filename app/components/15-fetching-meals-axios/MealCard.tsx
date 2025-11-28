import Image from "next/image";
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
    <div className="border border-border p-4 rounded-lg shadow-md bg-card hover:shadow-lg transition-shadow">
      <Image src={meal.image} alt={meal.name} className="w-full h-48 object-cover rounded-lg mb-4" width={500} height={500}/>
      <h3 className="text-xl font-bold mb-2 text-foreground">{meal.name}</h3>
      <p className="text-muted-foreground">{meal.instructions[0].substring(0, 100)}...</p>
    </div>
  );
};

export default MealCard;
