# Exercise: Rendering Multiple Components and Nesting Components

In this exercise, you will learn how to create multiple components and render one component inside another.

## Step 1: Create a Header Component

Create a new file called `Header.tsx`.
Inside this file, create a functional component named `Header`.
The `Header` component should return a `<header>` element with the following:
- A `<h1>` element with the text "Welcome to My Website!".
- A `<nav>` element containing three links (`<a>`) with the text "Home", "About", and "Contact".

## Step 2: Create a Footer Component

Create a new file called `Footer.tsx`.
Inside this file, create a functional component named `Footer`.
The `Footer` component should return a `<footer>` element with a `<p>` containing the text "© 2024 My Website".

## Step 3: Create a MainContent Component

Create a new file called `MainContent.tsx`.
Inside this file, create a functional component named `MainContent`.
The `MainContent` component should return a `<main>` element containing:
- A `<h2>` element with the text "Main Content".
- A `<p>` element with any text of your choice.

## Step 4: Render Components Inside `app/page.tsx`

In your `app/page.tsx` file, import the `Header`, `MainContent`, and `Footer` components.
Inside the `Home` component's return statement, render the three components inside a single `<div>`, in the following order:
1.  `Header`
2.  `MainContent`
3.  `Footer`
