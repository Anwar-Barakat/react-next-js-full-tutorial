# 24 - React Context API with TypeScript

In this exercise, you'll learn how to use React's Context API with TypeScript to manage global state across components without prop-drilling. You will create a simple counter application using Context.

## Instructions

### Step 1: Define Context and Provider
- Create a `MyContext.tsx` file.
- Define an interface `MyContextProps` for the context's value (e.g., `count: number`, `increment: () => void`, `decrement: () => void`).
- Create the context using `createContext` and explicitly type it.
- Create a custom hook `useMyContext` to consume the context, including a check to ensure it's used within the provider.
- Create a `MyProvider` component that manages the state (e.g., a counter) and provides it through the context.

### Step 2: Create a Consumer Component
- Create a `Counter.tsx` file.
- This component will consume the `MyContext` using the `useMyContext` hook.
- It should display the `count` and have buttons to `increment` and `decrement` it.

### Step 3: Create a Usage Example
- Create a `UsageExample.tsx` file.
- Import `MyProvider` and `Counter`.
- Wrap the `Counter` component (and any other components that need access to the context) with `MyProvider`.
- Apply basic styling using Tailwind CSS to make the components visually appealing and consistent with the dark theme.
