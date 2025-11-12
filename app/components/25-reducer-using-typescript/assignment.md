# 25 - useReducer with TypeScript

In this exercise, you'll build a to-do list application using the `useReducer` hook with TypeScript. This will demonstrate how to manage complex state logic in a type-safe and scalable way.

## Instructions

### Step 1: Define Types
- Create a `types.ts` file.
- Define an interface for a single `Todo` item (e.g., `{ id: number; text: string; completed: boolean; }`).
- Define a discriminated union `Action` type for the different actions your reducer will handle:
  - `ADD_TODO`: Should have a `payload` of type `string` (the new todo text).
  - `TOGGLE_TODO`: Should have a `payload` of type `number` (the id of the todo to toggle).
  - `DELETE_TODO`: Should have a `payload` of type `number` (the id of the todo to delete).

### Step 2: Create the Reducer
- Create a `todoReducer.ts` file.
- Implement the reducer function that takes the current `state` (an array of `Todo` items) and an `action` (`Action` type) and returns the new state.
- Use a `switch` statement to handle the different action types.

### Step 3: Create the TodoList Component
- Create a `TodoList.tsx` file.
- Import `useReducer`, your reducer function, and the necessary types.
- Initialize the state for your to-do list using `useReducer`.
- Build the UI:
  - An input field and a button to add new to-dos.
  - A list of to-do items.
  - Each to-do item should have a checkbox to toggle its completion status and a button to delete it.
- Dispatch the appropriate actions from your UI to interact with the state.
- Apply styling using Tailwind CSS to make the component visually appealing and consistent with the dark theme.

### Step 4: Update the Main Page
- Export the `TodoList` component from an `index.js` file.
- Update `app/page.tsx` to render your new `TodoList` component.
