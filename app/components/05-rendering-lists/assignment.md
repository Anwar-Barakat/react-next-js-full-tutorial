# Assignment: Rendering a List of Data with .map()

In this exercise, you will learn how to render a list of items using the `.map()` method in JSX.

## Step 1: Create a UserList Component

Create a new file called `UserList.tsx`.
Inside this file, create a functional component called `UserList`.
In the component, create a `users` array with the following objects, where each object represents a user with `id`, `name`, and `age`:

```typescript
const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 22 },
];
```

Use the `.map()` method to render a list of users. Each user's name and age should be displayed inside a `<div>` element. Use the `id` as the unique `key` for each list item.

## Step 2: Create a ProductList Component

Create a new file called `ProductList.tsx`.
Inside this file, create a functional component called `ProductList`.
Create a `products` array with the following objects, where each object represents a product with `id`, `name`, and `price`:

```typescript
const products = [
  { id: 1, name: "Phone", price: "$699" },
  { id: 2, name: "Laptop", price: "$1200" },
  { id: 3, name: "Headphones", price: "$199" },
];
```

Use the `.map()` method to render the list of products. Each product's name and price should be displayed inside a `<div>` element. Use the `id` as the `key` for each product.

## Step 3: Render the Components in `app/page.tsx`

In your `app/page.tsx` file, import the `UserList` and `ProductList` components.
Inside the `Home` component's return statement, render both the `UserList` and `ProductList` components.
