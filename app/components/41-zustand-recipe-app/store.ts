import { create } from "zustand";

export interface Recipe {
    id: number;
    name: string;
    ingredients: string[];
    instructions: string
}

type RecipeState = {
    recipes: Recipe[]
}

type RecipeAction = {
    addRecipe: (recipe: Recipe) => void;
    updateRecipe: (recipe: Recipe) => void;
    deleteRecipe: (id: number) => void
}

const useStore = create<RecipeState & RecipeAction>((set, get) => ({
    recipes: [],
    addRecipe: (recipe: Recipe) => (
        set((state) => ({
            recipes: [...state.recipes, recipe]
        }))
    ),
    updateRecipe: (recipe: Recipe) => (
        set((state) => ({
            recipes: state.recipes.map((rec) => (
                rec.id == recipe.id ? recipe : rec
            ))
        }))
    ),
    deleteRecipe: (id: number) => (
        set((state) => ({
            recipes: state.recipes.filter((rec) => (
                rec.id !== id
            ))
        }))
    ),
}))

export default useStore
