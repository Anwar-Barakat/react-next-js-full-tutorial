import { render, screen, fireEvent } from '@testing-library/react';
import RecipeApp from '../components/RecipeApp';
import useStore from '../store'; // Import original store to mock

// Mock the Zustand store
jest.mock('../store', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseStore = useStore as jest.Mock;

describe('RecipeApp', () => {
  const mockRecipes = [
    { id: 1, name: 'Pasta', ingredients: ['flour', 'eggs'], instructions: 'Mix and cook' },
    { id: 2, name: 'Salad', ingredients: ['lettuce', 'tomato'], instructions: 'Chop and toss' },
  ];

  let addRecipe: jest.Mock;
  let updateRecipe: jest.Mock;
  let deleteRecipe: jest.Mock;

  beforeEach(() => {
    addRecipe = jest.fn();
    updateRecipe = jest.fn();
    deleteRecipe = jest.fn();

    mockUseStore.mockReturnValue({
      recipes: mockRecipes,
      addRecipe,
      updateRecipe,
      deleteRecipe,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial recipes', () => {
    render(<RecipeApp />);

    expect(screen.getByRole('heading', { name: 'Add Recipe' })).toBeInTheDocument(); // Initial title
    expect(screen.getByPlaceholderText('Recipe name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingredients (comma separated)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Instructions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Recipe' })).toBeInTheDocument();
    expect(screen.getByText('My Recipes')).toBeInTheDocument();

    // Check if initial mock recipes are rendered
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });

  it('adds a new recipe', () => {
    render(<RecipeApp />);

    fireEvent.change(screen.getByPlaceholderText('Recipe name'), { target: { value: 'Pizza' } });
    fireEvent.change(screen.getByPlaceholderText('Ingredients (comma separated)'), { target: { value: 'Dough, Cheese' } });
    fireEvent.change(screen.getByPlaceholderText('Instructions'), { target: { value: 'Bake it' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Recipe' }));

    expect(addRecipe).toHaveBeenCalled();
    // Ensure form is cleared
    expect(screen.getByPlaceholderText('Recipe name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Ingredients (comma separated)')).toHaveValue('');
    expect(screen.getByPlaceholderText('Instructions')).toHaveValue('');
  });



  it('deletes a recipe', () => {
    render(<RecipeApp />);

    // Click delete on Pasta recipe
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]); // Get first delete button

    expect(deleteRecipe).toHaveBeenCalledWith(1);
  });

  it('does not add a recipe with empty fields', () => {
    render(<RecipeApp />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Recipe' })); // Click without filling

    expect(addRecipe).not.toHaveBeenCalled();
  });
});
