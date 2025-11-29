'use client';
import React, { useState } from "react";
import useStore, { Recipe } from "./store";

const RecipeApp = () => {
  const { recipes, addRecipe, updateRecipe, deleteRecipe } = useStore();
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);

  const handleSubmit = () => {
    if (!name.trim() || !ingredients.trim() || !instructions.trim()) return;

    const recipe: Recipe = {
      id: editRecipe ? editRecipe.id : Math.floor(Math.random() * 100000),
      name,
      ingredients: ingredients.split(",").map((ing) => ing.trim()),
      instructions,
    };

    if (editRecipe) {
      updateRecipe(recipe);
    } else {
      addRecipe(recipe);
    }

    setName("");
    setIngredients("");
    setInstructions("");
    setEditRecipe(null);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditRecipe(recipe);
    setName(recipe.name);
    setIngredients(recipe.ingredients.join(", "));
    setInstructions(recipe.instructions);
  };

  return (
    <div className="glass flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">{editRecipe ? "Edit Recipe" : "Add Recipe"}</h2>

      <input
        type="text"
        placeholder="Recipe name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input mb-2 w-full max-w-md bg-card/50"
      />
      <input
        type="text"
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="input mb-2 w-full max-w-md bg-card/50"
      />
      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="input mb-4 w-full max-w-md h-24 bg-card/50"
      />

      <button onClick={handleSubmit} className="btn bg-primary/50 mb-6">
        {editRecipe ? "Update Recipe" : "Add Recipe"}
      </button>

      <h3 className="text-xl font-bold text-foreground mb-3">My Recipes</h3>
      <ul className="w-full max-w-md bg-muted/50 rounded-lg p-4">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="bg-card/50 p-3 mb-2 rounded-md text-foreground">
            <strong>{recipe.name}</strong>
            <p className="text-sm text-muted-foreground">Ingredients: {recipe.ingredients.join(", ")}</p>
            <p className="text-sm text-muted-foreground">Instructions: {recipe.instructions}</p>
            <div className="flex space-x-2 mt-2">
              <button onClick={() => handleEdit(recipe)} className="btn btn-sm bg-accent/50">Edit</button>
              <button onClick={() => deleteRecipe(recipe.id)} className="btn btn-sm bg-secondary/50">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeApp;