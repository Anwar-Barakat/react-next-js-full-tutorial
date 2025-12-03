import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MealList from '../components/MealList';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the MealCard component as it's a child and we don't need to test its implementation here
jest.mock('../components/MealCard', () => {
  return ({ meal }: { meal: { id: number; name: string; image: string; instructions: string[] } }) => (
    <div data-testid={`meal-card-${meal.id}`}>
      <h3>{meal.name}</h3>
    </div>
  );
});

describe('MealList', () => {
  const mockRecipes = {
    recipes: [
      { id: 1, name: 'Pasta', image: 'pasta.jpg', instructions: ['Boil water'] },
      { id: 2, name: 'Salad', image: 'salad.jpg', instructions: ['Chop veggies'] },
    ],
  };

  beforeEach(() => {
    mockedAxios.get.mockClear();
  });

  it('renders loading state initially', () => {
    mockedAxios.get.mockReturnValueOnce(new Promise(() => {})); // Never resolve
    render(<MealList />);
    expect(screen.getByText('Loading meals...')).toBeInTheDocument();
  });

  it('renders meals after successful fetch', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockRecipes });
    render(<MealList />);

    expect(screen.getByText('Loading meals...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Delicious Meals')).toBeInTheDocument();
      expect(screen.getByText('Pasta')).toBeInTheDocument();
      expect(screen.getByText('Salad')).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading meals...')).not.toBeInTheDocument();
  });

  it('renders error message on fetch failure', async () => {
    const errorMessage = 'Failed to fetch meals.';
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    render(<MealList />);

    expect(screen.getByText('Loading meals...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading meals...')).not.toBeInTheDocument();
  });
});
