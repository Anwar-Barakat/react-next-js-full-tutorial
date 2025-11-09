# Assignment: Understanding useEffect in React

In this exercise, you'll practice using the `useEffect` hook in different scenarios, including fetching data, handling side effects.

## Step 1: Basic Usage of useEffect

Create a new file called `BasicEffect.tsx`.
Inside this file, create a functional component called `BasicEffect`.
Use `useEffect` to log a message to the console whenever the component mounts (i.e., when it's rendered the first time).

## Step 2: useEffect with Dependencies

Create a new file called `CounterEffect.tsx`.
Inside this file, create a functional component called `CounterEffect`.
Use `useEffect` to update the document title whenever a counter value changes.
Initialize a `count` state with 0 using `useState`.
Render a button that increments the count.
Use `useEffect` to update the document title whenever `count` changes.

## Step 3: useEffect for Fetching Data

Create a new file called `FetchDataEffect.tsx`.
Inside this file, create a functional component called `FetchDataEffect`.
Use `useEffect` to fetch data from an API when the component mounts.
Use the API endpoint `https://jsonplaceholder.typicode.com/posts` to fetch some data.
Store the data in a state variable and display the title of the first post.
