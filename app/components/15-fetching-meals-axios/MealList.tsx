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
        <div className="glass w-full max-w-md p-6 text-center">
          <p className="text-lg text-muted-foreground">Loading meals...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="glass w-full max-w-md p-6 text-center border-secondary">
          <p className="text-lg text-secondary">Error: {error}</p>
        </div>
    );
  }

  return (
        <div className="w-full">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Delicious Meals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
  );
};

export default MealList;