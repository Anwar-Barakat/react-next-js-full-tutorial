# Assignment: Fetching Meals and Displaying as Cards using Axios

In this exercise, you will learn how to fetch data from an API using Axios and display it as a list of cards.

## Step 1: Install Axios

If you haven't already, install Axios:
```bash
npm install axios
```

## Step 2: Create a `MealCard` Component

Create a new file called `MealCard.tsx`.
Inside this file, create a functional component called `MealCard` that accepts `meal` as a prop.
The `MealCard` component should display the meal's image, name, and a brief description (e.g., instructions or ingredients).

## Step 3: Create a `MealList` Component

Create a new file called `MealList.tsx`.
Inside this file, create a functional component called `MealList`.
This component should:
- Use `useState` to manage the list of meals.
- Use `useEffect` to fetch data from `https://dummyjson.com/recipes` using Axios when the component mounts.
- Display a loading message while fetching data.
- Display an error message if fetching fails.
- Map over the fetched meals and render a `MealCard` for each.

## Step 4: Render the Component in `app/page.tsx`

In your `app/page.tsx` file, import the `MealList` component.
Inside the `Home` component's return statement, render the `MealList` component.
