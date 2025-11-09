# Assignment: Using useRef in React

In this exercise, you will learn how to:
- Use `useRef` to reference DOM elements.
- Use `useRef` to store values that persist between renders without triggering re-renders.

## Step 1: Accessing a DOM Element with useRef

Create a new file called `FocusInput.tsx`.
Inside this file, create a functional component that will focus on an input field when a button is clicked, using the `useRef` hook.

## Step 2: Persisting Values Between Renders with useRef

Create a new file called `Timer.tsx`.
Inside this file, create a component that implements a simple timer, where the timer's interval is stored using `useRef`.

## Step 3: Render the Components in `app/page.tsx`

In your `app/page.tsx` file, import the `FocusInput` and `Timer` components.
Inside the `Home` component's return statement, render both components.
