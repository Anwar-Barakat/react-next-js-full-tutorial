'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MealCard from './MealCard';

interface Recipe {
  id: number;
  name: string;
  image: string;
  instructions: string[];
}

const MealList = () => {
  const [meals, setMeals] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/recipes');
        setMeals(response.data.recipes);
      } catch (err) {
        setError('Failed to fetch meals.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
          <p className="text-lg text-[var(--muted-foreground)] center-text">Loading meals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--secondary)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
          <p className="text-lg text-[var(--secondary)] center-text">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-7xl w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-8 center-text">
          Delicious Meals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealList;
