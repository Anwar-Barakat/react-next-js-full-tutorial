# Assignment: Custom Hook for Data Fetching (useFetch)

In this exercise, you will learn how to create a custom React Hook for fetching data from an API.

## Step 1: Create a `useFetch` Custom Hook

Create a new file called `useFetch.ts`.
Inside this file, create a custom hook named `useFetch` that takes a URL as an argument.
The hook should:
- Manage `data`, `loading`, and `error` states using `useState`.
- Use `useEffect` to fetch data from the provided URL when the component mounts or the URL changes.
- Return the `data`, `loading`, and `error` states.

## Step 2: Create a `FetchDataComponent` to use the Hook

Create a new file called `FetchDataComponent.tsx`.
Inside this file, create a functional component called `FetchDataComponent`.
This component should:
- Use the `useFetch` hook to fetch data from `https://jsonplaceholder.typicode.com/todos`.
- Display a loading message when `loading` is true.
- Display an error message if `error` occurs.
- If data is successfully fetched, display the `title` of each todo item.

## Step 3: Render the Component in `app/page.tsx`

In your `app/page.tsx` file, import the `FetchDataComponent`.
Inside the `Home` component's return statement, render the `FetchDataComponent`.
