# Assignment: Using Context and useContext in React

In this exercise, you will learn how to:
- Create a Context
- Use `useContext` to access data from the Context
- Share state and functions between components without using props

## Step 1: Creating a Context

Create a new file called `UserContext.tsx`.
Inside this file, create a `UserContext` and a `UserProvider` component that will hold the shared state.

## Step 2: Using useContext in Components

Create a new file called `UserProfile.tsx`.
Inside this file, create a functional component called `UserProfile`. This component will access the user data from `UserContext` using the `useContext` hook.

## Step 3: Updating Context Data

Create a new file called `UpdateUser.tsx`.
Inside this file, create a functional component called `UpdateUser` that allows the user to update their name.

## Step 4: Render the Components in `app/page.tsx`

In your `app/page.tsx` file, import the `UserProvider`, `UserProfile`, and `UpdateUser` components.
Wrap the `UserProfile` and `UpdateUser` components with the `UserProvider` to allow them to access the shared context.
