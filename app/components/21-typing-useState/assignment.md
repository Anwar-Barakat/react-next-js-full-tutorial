# 21 - Typing useState Hook in TypeScript

In this exercise, you'll practice typing the `useState` hook in TypeScript. You will define state types for various use cases and apply them in functional components to ensure type safety and clarity.

## Instructions

### Step 1: Basic useState Typing
- Create a `BasicState.tsx` component.
- Define a state variable with `useState` and type it explicitly (e.g., for a number or string).
- Include a button to modify this state.

### Step 2: Typing Complex State
- Create a `UserProfile.tsx` component.
- Define an interface for a user profile object (e.g., `name: string`, `age: number`, `email: string`).
- Define a state variable that holds an object of this `UserProfile` type and initialize it.
- Display the user profile information.
- Include a button to update a property of the user profile.

### Step 3: Typing State with Arrays
- Create a `TodoList.tsx` component.
- Define an interface for a to-do item (e.g., `id: number`, `text: string`, `completed: boolean`).
- Define a state variable for a list of to-do items (an array of `TodoItem` type) and initialize it.
- Display the list of to-do items.
- Include functionality to add a new to-do item to the list.

### Step 4: Usage Example
- Create a `UsageExample.tsx` component.
- Import and render `BasicState`, `UserProfile`, and `TodoList` components within `UsageExample.tsx`.
