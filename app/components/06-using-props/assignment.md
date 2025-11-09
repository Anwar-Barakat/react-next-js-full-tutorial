# Assignment: Using Props in React Components

In this exercise, you will learn how to pass and use props in React components to make them dynamic and reusable.

## Step 1: Create a Person Component

Create a new file called `Person.tsx`.
Inside this file, create a functional component called `Person`.
This component should accept props and render:
- A `<h2>` element that displays the person's name.
- A `<p>` element that displays the person's age.
Use `props.name` and `props.age` to display the dynamic values passed from the parent component.

## Step 2: Create a Product Component

Create a new file called `Product.tsx`.
Inside this file, create a functional component called `Product`.
This component should accept props and render:
- A `<h2>` element that displays the product's name.
- A `<p>` element that displays the product's price.
Use `props.name` and `props.price` to display the values passed from the parent component.

## Step 3: Pass Props from `app/page.tsx`

In your `app/page.tsx` file, import the `Person` and `Product` components.
Inside the `Home` component's return statement, render both components, passing appropriate props to each.
