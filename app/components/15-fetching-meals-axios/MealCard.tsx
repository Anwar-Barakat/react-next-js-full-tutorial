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
    <div className="border border-[var(--border)] p-4 rounded-[var(--radius)] shadow-[var(--shadow-md)] bg-[var(--card)] hover:shadow-[var(--shadow-lg)] transition-shadow">
      <Image src={meal.image} alt={meal.name} className="w-full h-48 object-cover rounded-[var(--radius)] mb-4" width={500} height={500}/>
      <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">{meal.name}</h3>
      <p className="text-[var(--muted-foreground)]">{meal.instructions[0].substring(0, 100)}...</p>
    </div>
  );
};

export default MealCard;
