# Assignment 26: Typing useReducer with TypeScript

## Objective:
In this exercise, you'll practice using the `useReducer` hook with TypeScript. You will create a state management system using `useReducer` and type the actions, state, and reducer function to ensure type safety.

## Instructions:

### Step 1: Define State and Actions
1.  Create a file named `counterReducer.ts` in the `26-useReducer-counter` directory.
2.  Inside `counterReducer.ts`, define the TypeScript types for:
    *   The `CounterState` (e.g., an object containing a `count: number`).
    *   The `CounterAction` (e.g., a union type for `'increment'`, `'decrement'`, and `'reset'` actions, with `'reset'` potentially including a `payload: number`).
3.  Define the `initialCounterState` constant with the initial value for your counter.
4.  Create the `counterReducer` function. This function should:
    *   Accept `state: CounterState` and `action: CounterAction` as parameters.
    *   Return a `CounterState`.
    *   Implement logic to update the count based on the `action.type`.
    *   Include a default case to handle unexpected actions, ensuring all action types are covered.

### Step 2: Create the Counter Component
1.  Create a file named `Counter.tsx` in the `26-useReducer-counter` directory.
2.  Inside `Counter.tsx`, create a functional React component named `Counter`.
3.  Use the `useReducer` hook within this component to manage the counter state and actions:
    *   Import the `counterReducer` and `initialCounterState` from `counterReducer.ts`.
    *   Initialize `useReducer` with your `counterReducer` and `initialCounterState`.
    *   Display the current count from the state.
    *   Create buttons for "Increment", "Decrement", and "Reset".
    *   Attach `onClick` handlers to these buttons to dispatch the corresponding `CounterAction` objects to your reducer.

### Step 3: Use the Component in App
1.  Open `app/page.tsx`.
2.  Import the `Counter` component into `app/page.tsx`.
3.  Render the `Counter` component within your `App` component's JSX (initially commented out).
